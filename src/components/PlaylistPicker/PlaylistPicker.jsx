import { useState } from 'react';
import './PlaylistPicker.css';

export default function PlaylistPicker({ playlists, onSelect, onManualInput, isPickerOpen, onTogglePicker, viewMode }) {
  if (playlists === null) return null;

  if (playlists.length === 0) {
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
    <div className={`playlist-picker ${!isPickerOpen ? 'is-collapsed' : ''}`}>
      {!isPickerOpen && (
        <div className="playlist-picker__header">
          <div className="playlist-picker__header-spacer" />

          <button 
            className="playlist-picker__toggle-btn btn-sonar is-collapsed"
            onClick={onTogglePicker}
            aria-expanded={isPickerOpen}
          >
            <div className="btn-shine"></div>
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </span>
            <div className="btn-text-content">
              <span className="btn-label">Kütüphaneden Seç</span>
            </div>
          </button>

          <div className="playlist-picker__header-right hidden">
            <button 
              className="playlist-picker__manual-link" 
              onClick={onManualInput}
            >
              veya Elle Gir
            </button>
          </div>
        </div>
      )}

      <div className={`playlist-picker__content-wrapper ${!isPickerOpen ? 'collapsed' : 'expanded'}`}>
        <div key={viewMode} className={`playlist-picker__grid playlist-picker__grid--${viewMode}`}>
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className={`playlist-picker__card animate-fade-in`}
              onClick={() => onSelect(playlist.id)}
            >
              {/* Arka Plan Sanatı */}
              <div className="playlist-picker__artwork-bg">
                {playlist.images && playlist.images[0] ? (
                  <img 
                    src={playlist.images[0].url} 
                    alt={playlist.name} 
                    className="playlist-picker__bg-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="playlist-picker__bg-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                )}
                <div className="playlist-picker__overlay"></div>
              </div>

              {/* Bilgi Bloğu */}
              <div className="playlist-picker__info-wrapper">
                <div className="playlist-picker__info">
                  <h4 className="playlist-picker__name" title={playlist.name}>{playlist.name}</h4>
                  {playlist.tracks && (
                    <p className="playlist-picker__track-count">
                      {playlist.tracks.total} Şarkı
                    </p>
                  )}
                </div>
              </div>

              {/* Alt Buton Bloğu */}
              <div className="playlist-picker__footer">
                <div className="playlist-picker__action-btn">
                  TARAMAYI BAŞLAT
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
