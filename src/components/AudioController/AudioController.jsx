import React, { useState, useEffect, useRef } from 'react';
import './AudioController.css';

export default function AudioController({ isMusicPlaying, onToggleMusic, musicVolume, onVolumeChange, onRestartMusic }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastVolumeRef = useRef(musicVolume > 0 ? musicVolume : 15);
  const volumeRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Müzik durduğunda 3 saniye sonra otomatik gizle
  useEffect(() => {
    if (!isMusicPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 3000); // 3 saniye bekle
    } else {
      // Müzik başladığında zamanlayıcıyı iptal et ve paneli aç
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      setIsCollapsed(false);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [isMusicPlaying]);

  // Manuel açma fonksiyonu
  const handleManualOpen = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setIsCollapsed(false);
  };

  // Native wheel listener to prevent page scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (isCollapsed) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -2 : 2;
      onVolumeChange((prev) => {
        const nextVolume = Math.min(100, Math.max(0, prev + delta));
        return nextVolume;
      });
    };

    const el = volumeRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener('wheel', handleWheel);
      }
    };
  }, [onVolumeChange, isCollapsed]);

  const toggleMute = () => {
    if (musicVolume > 0) {
      lastVolumeRef.current = musicVolume;
      onVolumeChange(0);
    } else {
      onVolumeChange(lastVolumeRef.current);
    }
  };

  return (
    <>
      {/* PANEL: Gizlendiğinde bu kısım gider */}
      <div className={`audio-controller ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="audio-controller__main">
          <button 
            className="audio-controller__rewind-btn"
            onClick={onRestartMusic}
            title="Başa Sar"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18V6h2v12H6zm3.5-6L19 18V6l-9.5 6z"></path>
            </svg>
          </button>

          <button 
            className={`audio-controller__play-btn ${isMusicPlaying ? 'playing' : ''}`}
            onClick={onToggleMusic}
            title={isMusicPlaying ? 'Sustur' : 'Başlat'}
          >
            {isMusicPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            )}
          </button>

          <div 
            ref={volumeRef}
            className="audio-controller__volume"
            onClick={toggleMute}
            title="Tıkla: Mute | Scroll: Ses Ayarı"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="audio-controller__volume-icon">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              {musicVolume > 40 ? (
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              ) : musicVolume > 0 ? (
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              ) : (
                <line x1="23" y1="9" x2="17" y2="15"></line>
              )}
            </svg>
            <span className="audio-controller__readout">
              {String(musicVolume).padStart(2, '0')}%
            </span>
          </div>
        </div>
      </div>

      {/* TEK OK: Panelden bağımsız, her zaman görünür */}
      <button 
        className={`audio-controller__toggle-btn ${isCollapsed ? 'is-collapsed' : ''}`}
        onClick={() => isCollapsed ? handleManualOpen() : setIsCollapsed(true)}
        title={isCollapsed ? "Göster" : "Gizle"}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {isCollapsed ? (
            <polyline points="15 18 9 12 15 6"></polyline>
          ) : (
            <polyline points="9 18 15 12 9 6"></polyline>
          )}
        </svg>
      </button>
    </>
  );
}
