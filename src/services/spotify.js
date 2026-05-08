/**
 * Spotify Servis Modülü
 * 
 * Spotify Web API ile iletişim kuran fonksiyonları içerir.
 * OAuth 2.0 Authorization Code Flow ile kullanıcı girişi,
 * playlist verisi çekme ve şarkı silme işlemlerini yönetir.
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

/**
 * Spotify'ın gerektirdiği kapsamları (scope) belirler.
 * playlist-read-private: Özel playlistleri okuma izni.
 * playlist-modify-public: Herkese açık playlistleri düzenleme izni.
 * playlist-modify-private: Özel playlistleri düzenleme izni.
 */
const SCOPES = [
  // Kullanıcı Bilgileri
  'user-read-private',
  'user-read-email',
  
  // Playlist Yetkileri
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  
  // Kütüphane (Beğenilen Şarkılar vb.) Yetkileri
  'user-library-read',
  'user-library-modify',
  
  // Geçmiş ve İstatistik Yetkileri
  'user-top-read',
  'user-read-recently-played'
].join(' ');

/**
 * PKCE için random string oluşturur.
 * @param {number} length - Oluşturulacak stringin uzunluğu.
 * @returns {string} - Rastgele karakter dizisi.
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

/**
 * PKCE code challenge oluşturur (SHA-256 hash).
 * @param {string} plain - Code verifier string.
 * @returns {Promise<string>} - Base64URL kodlanmış challenge.
 */
async function generateCodeChallenge(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Spotify giriş sayfasına yönlendirir (PKCE ile).
 * Kullanıcıyı Spotify OAuth ekranına gönderir.
 */
export async function loginWithSpotify() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // sessionStorage mobilde in-app browser veya Spotify app dönüşlerinde silinebiliyor.
  // Bu yüzden daha kalıcı olan localStorage'ı kullanıyoruz.
  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    show_dialog: true
  });

  // Spotify OAuth bazen URLSearchParams'in ürettiği "+" işaretli boşlukları algılayamıyor.
  // Bu yüzden scope'ları encodeURIComponent ile manuel olarak %20 şeklinde ekliyoruz.
  const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}&scope=${encodeURIComponent(SCOPES)}`;
  
  window.location.href = authUrl;
}

/**
 * Callback'ten dönen authorization code'u access token'a dönüştürür.
 * @param {string} code - Spotify'dan dönen authorization code.
 * @returns {Promise<Object>} - Access token, refresh token ve süre bilgisi.
 */
export async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  if (!codeVerifier) {
    console.error('Hata: code_verifier bulunamadı. Lütfen girişi tekrar başlatın.');
    throw new Error('Giriş güvenliği doğrulaması başarısız (code_verifier eksik).');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error('Spotify Token Exchange Error:', errorBody.error, errorBody.error_description || 'No description');
    throw new Error(`Token alınamadı: ${response.status} - ${errorBody.error_description || ''}`);
  }

  const data = await response.json();
  localStorage.setItem('spotify_access_token', data.access_token);
  localStorage.setItem('spotify_refresh_token', data.refresh_token);
  localStorage.setItem('spotify_token_expiry', Date.now() + data.expires_in * 1000);

  // Güvenlik için kullanılmış code_verifier'ı temizle
  localStorage.removeItem('spotify_code_verifier');

  return data;
}

/**
 * Mevcut access token'ı döndürür.
 * @returns {string|null} - Geçerli access token veya null.
 */
export function getAccessToken() {
  const expiry = localStorage.getItem('spotify_token_expiry');
  if (expiry && Date.now() > parseInt(expiry)) {
    return null;
  }
  return localStorage.getItem('spotify_access_token');
}

/**
 * Kullanıcının oturumunu sonlandırır.
 * Token bilgilerini localStorage'dan temizler.
 */
export function logoutSpotify() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  sessionStorage.removeItem('spotify_code_verifier');
}

/**
 * Spotify API'ye istek atan yardımcı fonksiyon.
 * @param {string} endpoint - API endpoint yolu (/v1 sonrası).
 * @param {Object} options - Fetch seçenekleri (method, body vb.).
 * @returns {Promise<Object>} - API yanıtı (JSON).
 */
async function spotifyFetch(endpoint, options = {}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Spotify oturumu bulunamadı. Lütfen giriş yapın.');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`Spotify API [${response.status}]:`, errorBody);
    throw new Error(`Spotify API Hatası: ${response.status} - ${errorBody?.error?.message || ''}`);
  }

  /* DELETE ve bazı isteklerde body dönmez (204 No Content) */
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

/**
 * Playlist linkinden playlist ID'sini ayıklar.
 * Desteklenen formatlar:
 *   - https://open.spotify.com/playlist/XXXXX
 *   - spotify:playlist:XXXXX
 * 
 * @param {string} url - Spotify playlist linki.
 * @returns {string|null} - Playlist ID veya null.
 */
export function extractPlaylistId(url) {
  if (!url) return null;

  /* Standart web linki */
  const webMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (webMatch) return webMatch[1];

  /* URI formatı */
  const uriMatch = url.match(/spotify:playlist:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  return null;
}

/**
 * Belirtilen playlist ID'sindeki tüm şarkıları çeker.
 * Development Mode kısıtlaması nedeniyle ana playlist endpoint'ini kullanır.
 * İlk 100 şarkıyı playlist objesinden, kalanları sayfalama ile çeker.
 * 
 * @param {string} playlistId - Spotify playlist ID.
 * @returns {Promise<Array>} - Tüm şarkılar ve sanatçı bilgileri.
 */
export async function fetchPlaylistTracks(playlistId) {
  const allTracks = [];

  /* Ana playlist objesinden ilk 100 şarkıyı al */
  const playlist = await spotifyFetch(`/playlists/${playlistId}`);

  console.log('DEBUG - Playlist response keys:', Object.keys(playlist));

  /* Spotify API farklı yapılarda veri dönebilir */
  let items = [];
  let nextUrl = null;

  if (playlist.tracks && playlist.tracks.items) {
    /* Standart yapı */
    items = playlist.tracks.items;
    nextUrl = playlist.tracks.next;
  } else if (playlist.items && Array.isArray(playlist.items)) {
    /* items doğrudan array ise */
    items = playlist.items;
    nextUrl = playlist.next;
  } else if (playlist.items && playlist.items.items) {
    /* items içinde items varsa */
    items = playlist.items.items;
    nextUrl = playlist.items.next;
  } else if (Array.isArray(playlist)) {
    /* Liste doğrudan array ise */
    items = playlist;
  }
  
  const info = {
    name: playlist.name,
    ownerId: playlist.owner?.id,
    id: playlist.id,
    snapshotId: playlist.snapshot_id // Snapshot ID silme işlemleri için kritik olabilir
  };

  if (items && items.length > 0) {
    const tracks = parseTrackItems(items);
    allTracks.push(...tracks);
  }
  while (nextUrl) {
    try {
      const token = getAccessToken();
      const response = await fetch(nextUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`Sayfalama başarısız (${response.status}). İlk ${allTracks.length} şarkı ile devam ediliyor.`);
        break;
      }

      const data = await response.json();
      if (data && data.items) {
        const tracks = parseTrackItems(data.items);
        allTracks.push(...tracks);
      }
      nextUrl = data.next;
    } catch (err) {
      console.warn('Sayfalama hatası:', err.message);
      break;
    }
  }

  return {
    tracks: allTracks,
    info
  };
}

/**
 * Spotify track item'larını uygulama formatına dönüştürür.
 * @param {Array} items - Spotify API'den gelen ham track item dizisi.
 * @returns {Array} - Dönüştürülmüş track nesneleri.
 */
function parseTrackItems(items) {
  return items
    .map(itemObj => {
      /* Bazı yanıtlar 'track' veya 'item' objesi içinde gelir, bazıları doğrudan track objesidir */
      const track = itemObj.track || itemObj.item || itemObj;
      
      /* Eğer track adı yoksa atla */
      if (!track || !track.name) return null;

      return {
        id: track.id,
        name: track.name,
        uri: track.uri,
        artists: track.artists?.map(a => ({ id: a.id, name: a.name })) || [],
        album: track.album?.name || 'Bilinmiyor',
        albumArt: track.album?.images?.[0]?.url || null
      };
    })
    .filter(Boolean);
}

/**
 * Playlistten belirtilen şarkıları kaldırır.
 * 
 * @param {string} playlistId - Spotify playlist ID.
 * @param {Array<string>} trackUris - Silinecek şarkı URI listesi.
 * @param {string} [snapshotId] - Playlist'in mevcut versiyon ID'si.
 */
export async function removeTracksFromPlaylist(playlistId, trackUris, snapshotId) {
  const uniqueUris = [...new Set(trackUris)].filter(uri => !uri.startsWith('spotify:local:'));
  
  if (uniqueUris.length === 0) return;

  const chunks = [];
  for (let i = 0; i < uniqueUris.length; i += 100) {
    chunks.push(uniqueUris.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const body = {
      items: chunk.map(uri => ({ uri }))
    };

    if (snapshotId) {
      body.snapshot_id = snapshotId;
    }

    await spotifyFetch(`/playlists/${playlistId}/items`, {
      method: 'DELETE',
      body: JSON.stringify(body)
    });
  }
}

/**
 * Kullanıcının Spotify profil bilgilerini döndürür.
 * @returns {Promise<Object>} - Kullanıcı adı, profil resmi vb.
 */
export async function fetchUserProfile() {
  return spotifyFetch('/me');
}

/**
 * Yeni bir playlist oluşturur.
 * 
 * @param {string} userId - Spotify kullanıcı ID'si.
 * @param {string} name - Yeni playlist adı.
 * @param {string} description - Playlist açıklaması.
 * @returns {Promise<Object>} - Oluşturulan playlist objesi.
 */
export async function createPlaylist(userId, name, description = '') {
  return spotifyFetch(`/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: false
    })
  });
}

/**
 * Belirtilen playliste şarkılar ekler.
 * 
 * @param {string} playlistId - Hedef playlist ID.
 * @param {Array<string>} trackUris - Eklenecek şarkıların URI listesi.
 * @returns {Promise<void>}
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
  /* Spotify bir seferde en fazla 100 şarkı eklemeye izin verir */
  const chunks = [];
  for (let i = 0; i < trackUris.length; i += 100) {
    chunks.push(trackUris.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    await spotifyFetch(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({
        uris: chunk
      })
    });
  }
}
