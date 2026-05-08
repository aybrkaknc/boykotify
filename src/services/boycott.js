/**
 * Boykot Servis Modülü
 * 
 * Supabase veritabanından boykot/vatansever verilerini çeker
 * ve playlist şarkılarını bu verilerle eşleştirir.
 */
import { supabase } from '../lib/supabase';

/**
 * Tüm boykot/vatansever kayıtlarını Supabase'den çeker.
 * @returns {Promise<Array>} - Tüm kayıtlar (isim, tür, durum, neden, kaynak).
 */
export async function fetchAllEntities() {
  if (!supabase) {
    console.warn('Supabase bağlantısı yok. Demo veriler kullanılıyor.');
    return getDemoEntities();
  }

  const { data, error } = await supabase
    .from('entities')
    .select('*');

  if (error) {
    console.error('Veritabanı hatası:', error.message);
    return getDemoEntities();
  }

  /* Debug: Kaç kayıt geldiğini görelim */
  console.log('Veritabanından çekilen toplam kayıt sayısı:', data?.length || 0);

  return data || [];
}

/**
 * Playlist şarkılarını boykot veritabanıyla eşleştirir.
 * Her şarkı için sanatçısının durumunu (boycott/patriotic/unknown) belirler.
 * 
 * @param {Array} tracks - Spotify'dan çekilen şarkı listesi.
 * @param {Array} entities - Veritabanındaki kayıtlar.
 * @returns {Array} - Durumu işaretlenmiş şarkı listesi.
 */
export function matchTracksWithEntities(tracks, entities) {
  /* Hızlı arama için iki ayrı Map oluştur (ID ve İsim) */
  const entityIdMap = new Map();
  const entityNameMap = new Map();
  
  entities.forEach(entity => {
    if (entity.spotify_id) {
      entityIdMap.set(entity.spotify_id, entity);
    }
    const name = entity.name.toLocaleUpperCase('tr-TR').trim();
    entityNameMap.set(name, entity);
  });

  return tracks.map(track => {
    let trackStatus = 'unknown';
    let matchedEntity = null;

    /* Her sanatçıyı kontrol et */
    for (const artist of track.artists) {
      /* Önce Kesin Eşleşme (Spotify ID) ara */
      let entity = entityIdMap.get(artist.id);

      /* ID ile bulunamadıysa İsim ile ara (Yedek Plan) */
      if (!entity) {
        const normalizedName = artist.name.toLocaleUpperCase('tr-TR').trim();
        entity = entityNameMap.get(normalizedName);
      }

      if (entity) {
        trackStatus = entity.status;
        matchedEntity = entity;
        /* Boykot bulunduysa diğer sanatçılara bakmaya gerek yok */
        if (entity.status === 'boycott') break;
      }
    }

    return {
      ...track,
      status: trackStatus,
      entity: matchedEntity
    };
  });
}

/**
 * Vatanseverlik skorunu hesaplar.
 * Formül: 100 - ((Boykotlu Şarkı Sayısı / Toplam Şarkı Sayısı) * 100)
 * 
 * @param {Array} matchedTracks - Eşleştirilmiş şarkı listesi.
 * @returns {Object} - Skor ve istatistikler.
 */
export function calculatePatriotScore(matchedTracks) {
  const total = matchedTracks.length;
  const boycottCount = matchedTracks.filter(t => t.status === 'boycott').length;
  const patrioticCount = matchedTracks.filter(t => t.status === 'patriotic').length;
  const unknownCount = matchedTracks.filter(t => t.status === 'unknown').length;

  /* Yeni Formül: Toplam şarkılar içindeki boykotlu olmayanların yüzdesi */
  const score = total > 0 ? Math.round(100 - ((boycottCount / total) * 100)) : 100;

  return {
    score,
    total,
    boycottCount,
    patrioticCount,
    unknownCount
  };
}

/**
 * Supabase bağlantısı olmadığında kullanılacak demo veriler.
 * Geliştirme ve test aşamasında kullanışlıdır.
 * 
 * @returns {Array} - Örnek boykot/vatansever verileri.
 */
function getDemoEntities() {
  return [
    {
      name: 'Demo Boykotlu Sanatçı',
      type: 'artist',
      status: 'boycott',
      reason: 'Bu bir demo veridir. Supabase bağlantısını yapılandırarak gerçek verileri kullanabilirsiniz.',
      source_url: ''
    },
    {
      name: 'Demo Vatansever Sanatçı',
      type: 'artist',
      status: 'patriotic',
      reason: 'Bu bir demo veridir.',
      source_url: ''
    }
  ];
}
