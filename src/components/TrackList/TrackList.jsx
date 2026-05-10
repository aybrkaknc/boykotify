/**
 * TrackList Bileşeni
 * 
 * Playlist şarkılarını boykot durumlarıyla birlikte listeler.
 * Boykotlular kırmızı, vatanseverler yeşil outline ile gösterilir.
 * Hover ile detay popup'ı açılır.
 * 
 * @param {Object} props
 * @param {Array} props.tracks - Eşleştirilmiş şarkı listesi.
 * @param {boolean} props.canRemove - Kullanıcı silme yetkisine sahip mi.
 * @param {Function} props.onRemoveBoycotted - Boykotlu şarkıları silme callback'i.
 */
import { useState, useRef } from 'react';
import './TrackList.css';

export default function TrackList({ tracks, activeFilter = 'all', canRemove, onRemoveBoycotted, onRefresh, isLoading }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const boycottedTracks = tracks.filter(t => t.status === 'boycott');

  /**
   * Şarkıları aktif filtreye göre süzer.
   */
  function getFilteredTracks() {
    switch (activeFilter) {
      case 'boycott':
        return tracks.filter(t => t.status === 'boycott');
      case 'patriotic':
        return tracks.filter(t => t.status === 'patriotic');
      case 'unknown':
        return tracks.filter(t => t.status === 'unknown');
      default:
        return tracks;
    }
  }

  /**
   * Boykotlu şarkıları toplu silme işlemini başlatır.
   */
  async function handleRemoveBoycotted() {
    if (!onRemoveBoycotted || boycottedTracks.length === 0) return;
    setIsRemoving(true);
    try {
      await onRemoveBoycotted(boycottedTracks.map(t => t.uri));
    } finally {
      setIsRemoving(false);
    }
  }

  const filteredTracks = getFilteredTracks();

  return (
    <section className="track-list" id="track-list-section">
      <div className="track-list__header">
        <div className="track-list__title-wrapper">
          <h2 className="track-list__title">
            {activeFilter === 'all' && 'Tüm Şarkılar'}
            {activeFilter === 'boycott' && 'Boykotlu Sanatçılar'}
            {activeFilter === 'patriotic' && 'Vatansever Sanatçılar'}
            {activeFilter === 'unknown' && 'İnceleme Altındakiler'}
          </h2>
          {onRefresh && (
            <button 
              className={`track-list__refresh-btn ${isLoading ? 'track-list__refresh-btn--loading' : ''}`}
              onClick={onRefresh}
              disabled={isLoading}
              title="Listeyi Yenile"
            >
              ↻
            </button>
          )}
        </div>

        {canRemove && boycottedTracks.length > 0 && (
          <button
            className="track-list__remove-btn"
            onClick={handleRemoveBoycotted}
            disabled={isRemoving}
            id="remove-boycotted-button"
          >
            {isRemoving ? 'Temizleniyor...' : `Hepsine Has*ktir! (${boycottedTracks.length})`}
          </button>
        )}
      </div>

      <div className="track-list__grid">
        {filteredTracks.map((track, index) => (
          <TrackCard 
            key={`${track.id}-${index}`} 
            track={track} 
            canRemove={canRemove} 
            onRemove={onRemoveBoycotted} 
          />
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <p className="track-list__empty">Bu kategori tertemiz!</p>
      )}
    </section>
  );
}

/**
 * TrackCard Bileşeni
 * 
 * Tek bir şarkıyı temsil eden kart bileşeni.
 * Duruma göre kırmızı/yeşil kenarlık ve hover popup gösterir.
 * 
 * @param {Object} props
 * @param {boolean} props.canRemove - Şarkıyı silme yetkisi.
 * @param {Function} props.onRemove - Tek şarkı silme callback'i.
 */
function TrackCard({ track, canRemove, onRemove }) {
  const statusClass = track.status !== 'unknown' ? `track-card--${track.status}` : '';
  const [popupPos, setPopupPos] = useState('top');
  const cardRef = useRef(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.top < 250) {
      setPopupPos('bottom');
    } else {
      setPopupPos('top');
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (canRemove && onRemove) {
      setIsAnimatingOut(true);
      // Animasyon süresi 400ms (CSS ile uyumlu)
      setTimeout(() => {
        onRemove([track.uri]);
      }, 400);
    }
  };

  return (
    <div 
      className={`track-card ${statusClass} ${isAnimatingOut ? 'track-card--removing' : ''}`} 
      id={`track-${track.id}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
    >
      <div className="track-card__artwork">
        {track.albumArt ? (
          <img src={track.albumArt} alt={track.album} className="track-card__image" loading="lazy" />
        ) : (
          <div className="track-card__placeholder">♪</div>
        )}
        {track.status === 'patriotic' && <span className="track-card__badge track-card__badge--patriotic">★</span>}
      </div>

      {/* Alakasız ve Vatansever şarkılar için sağ üst köşede beyaz silme butonu */}
      {track.status !== 'boycott' && canRemove && (
        <button 
          className="track-card__remove-btn-minimal"
          onClick={handleAction}
          disabled={isAnimatingOut}
          title="Listeden çıkar"
        >
          ✕
        </button>
      )}

      <div className="track-card__info">
        <h4 className="track-card__name">{track.name}</h4>
        <p className="track-card__artist">{track.artists.map(a => a.name).join(', ')}</p>
        <p className="track-card__album">{track.album}</p>
      </div>

      {track.status === 'boycott' && canRemove && (
        <button 
          className="track-card__action-btn"
          onClick={handleAction}
          disabled={isAnimatingOut}
        >
          {isAnimatingOut ? '...' : 'S*KTİR ET!'}
        </button>
      )}

      {/* Hover Popup - Boykot veya Vatansever bilgisi */}
      {track.entity && (
        <div className={`track-card__popup track-card__popup--pos-${popupPos}`}>
          <div className="track-card__popup-header">
            <span className={`track-card__popup-status track-card__popup-status--${track.status}`}>
              {track.status === 'boycott' ? 'BOYKOT' : track.status === 'patriotic' ? 'VATANSEVER' : 'BİLİNMİYOR'}
            </span>
            <span className="track-card__popup-entity">{track.entity.name}</span>
          </div>
          {track.entity.reason && (
            <p className="track-card__popup-reason">{track.entity.reason}</p>
          )}
          {track.entity.source_url && (
            <a
              className="track-card__popup-source"
              href={track.entity.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kaynak →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
