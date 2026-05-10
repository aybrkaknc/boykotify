/**
 * PlaylistInput Bileşeni
 * 
 * Kullanıcının Spotify playlist linkini yapıştırdığı giriş alanı.
 * Link geçerliliğini kontrol eder ve tarama başlatır.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Geçerli link girildiğinde çağrılır.
 * @param {boolean} props.isLoading - Tarama devam ediyor mu.
 */
import { useState } from 'react';
import { extractPlaylistId } from '../../services/spotify';
import './PlaylistInput.css';

export default function PlaylistInput({ onSubmit, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  /**
   * Form gönderildiğinde linki doğrular ve callback'i çağırır.
   * @param {Event} e - Form submit event'i.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!inputValue.trim()) {
      setError('Lütfen bir link giriniz.');
      return;
    }

    onSubmit(inputValue.trim());
  }

  return (
    <section className="playlist-input" id="playlist-input-section">
      <form className="playlist-input__form" onSubmit={handleSubmit}>
          <div className="playlist-input__field-wrapper">
            <input
              type="text"
              className="playlist-input__field"
              placeholder="https://open.spotify.com/playlist/..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              id="playlist-url-input"
            />
            <button
              type="submit"
              className="playlist-input__submit btn-sonar"
              disabled={isLoading || !inputValue.trim()}
              id="scan-button"
              aria-label="Tarayıcıyı Başlat"
            >
              {isLoading ? (
                <span className="playlist-input__spinner" />
              ) : (
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="playlist-input__icon"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </div>
          {error && <p className="playlist-input__error">{error}</p>}
        </form>
    </section>
  );
}
