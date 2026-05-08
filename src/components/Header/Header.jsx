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
import './Header.css';

export default function Header({ user, onLogin, onLogout }) {
  return (
    <header className="header" id="app-header">
      <div className="header__inner">
        <div className="header__brand">
          <a href="/" className="header__logo-link">
            <h1 className="header__title">Boykotify</h1>
          </a>
        </div>

        <div className="header__actions">
          {user ? (
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
          ) : (
            <button
              className="header__btn header__btn--login"
              onClick={onLogin}
              id="login-button"
            >
              <svg className="header__spotify-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify ile Giriş Yap
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
