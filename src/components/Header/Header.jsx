/**
 * Header Bileşeni
 * 
 * Uygulamanın üst çubuğunu oluşturur.
 * Logo, uygulama adı ve Spotify giriş/çıkış butonunu içerir.
 * 
 * @param {Object} props
 * @param {Object|null} props.user - Spotify kullanıcı bilgisi.
 * @param {Function} props.onLogin - Giriş butonuna tıklandığında çağrılır.
 * @param {Function} props.onLogout - Çıkış butonuna tıklandığında çağrılır.
 */
import { useState, useEffect, useRef } from 'react';
import './Header.css';

export default function Header({ user, onLogin, onLogout }) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const helpRef = useRef(null);

  // Dışarı tıklamayı yakala
  useEffect(() => {
    function handleClickOutside(event) {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsPinned(false);
      }
    }

    if (isPinned) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinned]);

  const showHelp = isPinned || isHovered;

  return (
    <header className="header" id="app-header">
      <div className="header__inner">
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
                      <li>Bir çalma listesi linkini kutuya yapıştırın.</li>
                      <li>Boykotlu şarkıları tek tıkla listenizden temizleyin.</li>
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

          <div className="header__brand">
            <a href="/" className="header__logo-link">
              <h1 className="header__title">Boykotify</h1>
            </a>
          </div>
        </div>

        <div className="header__actions">
          {user && (
            <div className="header__user">
              {user.images?.[0] && (
                <img
                  className="header__avatar"
                  src={user.images[0].url}
                  alt={user.display_name}
                />
              )}
              <span className="header__username">{user.display_name}</span>
              <button
                className="header__btn header__btn--logout"
                onClick={onLogout}
                id="logout-button"
              >
                Çıkış
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
