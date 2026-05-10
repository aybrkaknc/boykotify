import { useState } from 'react';
import './PlaylistPicker.css';

export default function PlaylistPicker({ playlists, onSelect, onManualInput }) {
  const [viewMode, setViewMode] = useState('grid');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!playlists || playlists.length === 0) {
    return (
      <div className="playlist-picker__empty">
        <p>Kütüphanenizde çalma listesi bulunamadı.</p>
        <button className="playlist-picker__manual-link" onClick={onManualInput}>
          Link ile manuel ara
        </button>
      </div>
    );
  }

  return (
    <div className={`playlist-picker ${isCollapsed ? 'is-collapsed' : ''}`}>
      <div className="playlist-picker__header">
        <div className="playlist-picker__header-left">
          <button 
            className={`playlist-picker__collapse-btn ${isCollapsed ? 'collapsed' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Genişlet' : 'Daralt'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <h3 
            className="playlist-picker__title" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ cursor: 'pointer' }}
          >
            Kütüphaneden Seç
          </h3>
          <button 
            className="playlist-picker__manual-link" 
            onClick={onManualInput}
          >
            veya Elle Gir
          </button>
        </div>
        <div className={`playlist-picker__view-controls ${isCollapsed ? 'hidden' : ''}`}>
          <div className={`playlist-picker__view-indicator playlist-picker__view-indicator--${viewMode}`} />
          <button 
            className={`playlist-picker__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Izgara Görünümü"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            className={`playlist-picker__view-btn ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setViewMode('compact')}
            title="Kompakt Görünüm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className={`playlist-picker__content-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <div key={viewMode} className={`playlist-picker__grid playlist-picker__grid--${viewMode}`}>
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className={`playlist-picker__card playlist-picker__card--${viewMode} animate-fade-in`}
              onClick={() => onSelect(playlist.id)}
            >
              {viewMode === 'grid' && (
                <div className="playlist-picker__image-container">
                  {playlist.images && playlist.images[0] ? (
                    <img 
                      src={playlist.images[0].url} 
                      alt={playlist.name} 
                      className="playlist-picker__image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="playlist-picker__image-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <div className="playlist-picker__info">
                <h4 className="playlist-picker__name">{playlist.name}</h4>
              </div>
              <div className="playlist-picker__card-overlay">
                <span className="playlist-picker__scan-btn">TARAMAYI BAŞLAT</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
