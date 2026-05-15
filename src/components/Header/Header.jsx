import { useState, useEffect, useRef } from 'react';
import './Header.css';

export default function Header({ 
  user, 
  onLogin, 
  onLogout, 
  isScrolled,
  isPickerOpen,
  onTogglePicker,
  onManualInput,
  viewMode,
  onViewModeChange,
  hasPlaylists
}) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const helpRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsPinned(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isPinned || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinned, isUserMenuOpen]);

  const showHelp = isPinned || isHovered;

  return (
    <header className={`header ${isPickerOpen ? 'header--picker-mode' : ''} ${isScrolled ? 'header--scrolled' : ''}`} id="app-header">
      <div className="header__inner">
        {/* Normal Header İçeriği */}
        <div className={`header__content-group ${isPickerOpen ? 'header__content-group--hidden' : ''}`}>
          <div className="header__left">
            <div 
              className="header__help" 
              ref={helpRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button 
                className={`header__help-btn ${isPinned ? 'active' : ''}`}
                onClick={() => setIsPinned(!isPinned)}
                aria-label="Yardım ve Rehber"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              
              {showHelp && (
                <div className="header__help-popup">
                  <div className="header__help-content">
                    <div className="header__help-section">
                      <h4>NEDİR?</h4>
                      <p>Playlistinde kime para kazandırdığını sanıyorsun? Dinlediğin her stream vatanımıza sırt dönenlere sermaye olmasın. Boykotify ile listeni saniyeler içinde tarat, ihaneti tespit et ve müziğini tek tıkla tertemiz yap. Milli şuur bunu gerektirir!</p>
                    </div>
                    <div className="header__help-section">
                      <h4>NASIL KULLANILIR?</h4>
                      <ol>
                        <li>Spotify hesabınızla güvenli giriş yapın.</li>
                        <li><strong>Kütüphaneden Seç</strong> ile listelerinizi saniyeler içinde tarayın ve boykotlu şarkıları <strong>tek tıkla temizleyin.</strong></li>
                        <li><strong>Elle Gir</strong> seçeneği ile çalma listesi linkini yapıştırarak da tarama yapabilirsiniz.</li>
                        <li>Milli bilinci koruyun ve müziğinizi arındırın.</li>
                      </ol>
                    </div>
                    <div className="header__help-footer">
                      <a 
                        href="https://github.com/aybrkaknc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="header__help-link"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="header__patriotic">
              <img 
                src="https://flagcdn.com/w160/tr.png" 
                alt="Türk Bayrağı" 
                className="header__patriotic-flag"
              />
            </div>

            <div className="header__brand">
              <a href="/" className="header__logo-link">
                <h1 className="header__title">Boykotify</h1>
              </a>
            </div>
          </div>

          <div className="header__actions">
            {user && (
              <div className="header__user" ref={userMenuRef}>
                <div 
                  className={`header__user-trigger ${isUserMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="header__username">{user.display_name}</span>
                  {user.images?.[0] && (
                    <img
                      className="header__avatar"
                      src={user.images[0].url}
                      alt={user.display_name}
                    />
                  )}
                </div>

                {isUserMenuOpen && (
                  <div className="header__user-dropdown">
                    <button
                      className="header__dropdown-btn header__dropdown-btn--logout"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Yeni Picker Görünümü (Expanded Mode) */}
        <div className={`header__picker-mode ${isPickerOpen ? 'header__picker-mode--visible' : ''}`}>
          <div className="header__picker-left">
            <button 
              className="header__picker-toggle-btn btn-sonar"
              onClick={onTogglePicker}
            >
              <div className="btn-shine"></div>
              <span className="btn-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
              <div className="btn-text-content">
                <span className="btn-label">Kütüphaneyi Gizle</span>
              </div>
            </button>
          </div>
          
          <div className="header__picker-center">
            <h2 className="header__picker-title">
              Müziğinde <a 
                href="https://www.youtube.com/playlist?list=PLCeSne8xqy-CaTlFHHzkrRA7bMASJCpSW" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="header__picker-accent"
              >İhanete</a> İzin Verme!
            </h2>
          </div>

          <div className="header__picker-right">
            <button className="header__picker-manual-link" onClick={onManualInput}>
              veya Elle Gir
            </button>
            {hasPlaylists && (
              <div className="header__picker-view-controls">
                <div className={`header__picker-view-indicator header__picker-view-indicator--${viewMode}`} />
                <button 
                  className={`header__picker-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('grid')}
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
                  className={`header__picker-view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('compact')}
                  title="Kompakt Görünüm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
