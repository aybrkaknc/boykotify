/**
 * App - Ana Uygulama Bileşeni
 * 
 * Boykotify uygulamasının kök bileşeni.
 * Spotify OAuth akışını, playlist taramayı ve sonuç gösterimini yönetir.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header/Header';
import PlaylistInput from './components/PlaylistInput/PlaylistInput';
import ScoreCard from './components/ScoreCard/ScoreCard';
import TrackList from './components/TrackList/TrackList';
import BoycottMarquee from './components/BoycottMarquee/BoycottMarquee';
import {
  loginWithSpotify,
  exchangeCodeForToken,
  getAccessToken,
  logoutSpotify,
  fetchPlaylistTracks,
  removeTracksFromPlaylist,
  fetchUserProfile,
  extractPlaylistId
} from './services/spotify';
import {
  fetchAllEntities,
  matchTracksWithEntities,
  calculatePatriotScore
} from './services/boycott';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedTracks, setMatchedTracks] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [error, setError] = useState('');
  const [errorSolution, setErrorSolution] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  /* OAuth'un çift çalışmasını engellemek için flag */
  const authProcessed = useRef(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [modalType, setModalType] = useState('error'); // 'error' veya 'success'
  const [isCopied, setIsCopied] = useState(false);
  const [allEntities, setAllEntities] = useState([]);

  /**
   * Sayfa yüklendiğinde OAuth callback'ini, mevcut oturumu ve veritabanını kontrol eder.
   */
  useEffect(() => {
    handleAuthCallback();
    checkExistingSession();
    loadAllEntities();
  }, []);

  /**
   * Tüm boykot/vatansever listesini yükler.
   */
  async function loadAllEntities() {
    const data = await fetchAllEntities();
    setAllEntities(data);
  }

  /**
   * Spotify OAuth callback'inden dönen kodu yakalar ve token'a dönüştürür.
   * React 18 StrictMode çift çalıştırma koruması içerir.
   */
  async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      await checkExistingSession();
      return;
    }

    try {
      /* Çift çalışmayı ve URL'de kod kalmasını önlemek için anında temizle */
      window.history.replaceState({}, document.title, '/');
      
      await exchangeCodeForToken(code);
      await loadUserProfile();
    } catch (err) {
      console.error('Token alınamadı:', err);
      /* Hata durumunda da URL'yi temizle ki loop'a girmesin */
      window.history.replaceState({}, document.title, '/');
      
      setModalType('error');
      setError('Spotify hesabınızla bağlantı kurulamadı.');
      setErrorSolution('Mobil cihazlarda "Özel Mod" (Incognito) kullanıyorsanız giriş başarısız olabilir. Lütfen normal sekmede deneyin.');
      setErrorDetails(err.message);
    }
  }

  /**
   * useEffect içindeki akış: Önce callback (varsa), sonra mevcut oturum.
   */
  useEffect(() => {
    if (authProcessed.current) return;
    authProcessed.current = true;

    const initApp = async () => {
      await handleAuthCallback();
      await loadAllEntities();
    };
    
    initApp();
  }, []);

  /**
   * localStorage'da mevcut bir oturum varsa profili yükler.
   */
  async function checkExistingSession() {
    const token = getAccessToken();
    if (token) {
      await loadUserProfile();
    }
  }

  /**
   * Kullanıcının Spotify profil bilgilerini çeker.
   */
  async function loadUserProfile() {
    try {
      const profile = await fetchUserProfile();
      setUser(profile);
    } catch (err) {
      console.error('Profil yüklenemedi:', err);
      logoutSpotify();
    }
  }

  /**
   * Spotify giriş işlemini başlatır.
   */
  function handleLogin() {
    loginWithSpotify();
  }

  /**
   * Oturumu sonlandırır ve state'i sıfırlar.
   */
  function handleLogout() {
    logoutSpotify();
    setUser(null);
    setMatchedTracks([]);
    setStats(null);
    setCurrentPlaylistId(null);
  }

  /**
   * Playlist tarama işlemini başlatır.
   * Spotify API'den şarkıları çeker ve boykot veritabanıyla eşleştirir.
   * 
   * @param {string} playlistId - Taranacak playlist ID'si.
   */
  const handleScanPlaylist = useCallback(async (playlistId) => {
    setIsLoading(true);
    setError('');
    setErrorSolution('');
    setErrorDetails('');
    setModalType('error');
    setShowErrorDetails(false);
    setMatchedTracks([]);
    setStats(null);

    try {
      /* Paralel olarak şarkıları ve boykot verilerini çek */
      const [{ tracks, info: playlistInfo }, entities] = await Promise.all([
        fetchPlaylistTracks(playlistId),
        fetchAllEntities()
      ]);

      /* Şarkıları boykot veritabanıyla eşleştir */
      const matched = matchTracksWithEntities(tracks, entities);
      const score = calculatePatriotScore(matched);
      score.playlistInfo = playlistInfo;
      
      /* Marquee'nin güncel verilerle beslenmesi için state'i güncelle */
      setAllEntities(entities);

      /* Boykotlu şarkıları liste başına gelecek şekilde sırala */
      const sortedMatched = matched.sort((a, b) => {
        if (a.status === 'boycott' && b.status !== 'boycott') return -1;
        if (b.status === 'boycott' && a.status !== 'boycott') return 1;
        return 0;
      });

      setMatchedTracks(sortedMatched);
      setStats(score);
      setCurrentPlaylistId(playlistId);
    } catch (err) {
      console.error('Tarama hatası:', err);
      setModalType('error');
      setError('Playlist bulunamadı veya taranırken bir sorun oluştu.');
      setErrorSolution('Girdiğiniz Spotify linkinin doğru olduğundan ve playlistin gizli (private) olmadığından emin olun.');
      setErrorDetails(err.stack || err.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Seçilen şarkıları belirtilen listeden siler.
   * @param {Array<string>} trackUris - İşlenecek şarkı URI listesi
   */
  async function handleRemoveBoycotted(trackUris) {
    if (!currentPlaylistId || !user) return;

    try {
      // Silmeyi dene
      await removeTracksFromPlaylist(currentPlaylistId, trackUris, stats?.playlistInfo?.snapshotId);

      /* Silinen şarkıları listeden kaldır */
      const updatedTracks = matchedTracks.filter(t => !trackUris.includes(t.uri));
      const updatedStats = calculatePatriotScore(updatedTracks);
      updatedStats.playlistInfo = stats.playlistInfo;

      setMatchedTracks(updatedTracks);
      setStats(updatedStats);

    } catch (err) {
      console.error('İşlem hatası:', err);
      
      setModalType('error');
      setError('Şarkılar Spotify üzerinden işlenemedi.');
      setErrorSolution('Bağlantı hatası veya yetki eksikliği olabilir. Spotify oturumunuzu tazelemeyi deneyin.');
      setErrorDetails(err.stack || err.message || JSON.stringify(err));
    }
  }

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(errorDetails);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const hasResults = stats !== null;
  const canRemove = !!user && !!currentPlaylistId;

  return (
    <div className={`app ${hasResults ? 'app--has-results' : ''}`} id="app-root">
      {/* Sol Kenar — Sonsuz Kayan Sanatçı Listesi */}
      <BoycottMarquee entities={allEntities} />

      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="app__main">
        {/* Karşılama Bölümü */}
        {!hasResults && !isLoading && (
          <section className="app__hero" id="hero-section">
            <div className="app__hero-content">
              <h2 className="app__hero-title">
                Müziğinde <a 
                  href="https://www.youtube.com/playlist?list=PLCeSne8xqy-CaTlFHHzkrRA7bMASJCpSW" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="app__hero-accent app__hero-link"
                >İhanete</a> Yer Verme!
              </h2>
              <p className="app__hero-description">
                Kime destek olduğunu bil. Gözünden kaçanları biz yakalayalım, 
                playlistini milli şuurla saniyeler içinde temizle.
              </p>
              <PlaylistInput onSubmit={handleScanPlaylist} isLoading={isLoading} />
            </div>
          </section>
        )}
          {/* Modal Overlay (Hata veya Başarı) */}
        {error && (
          <div 
            className="app__error-overlay" 
            id="error-message"
            onClick={() => {
              setError('');
              setErrorSolution('');
              setErrorDetails('');
              setShowErrorDetails(false);
            }}
          >
            <div 
              className={`app__error-modal ${modalType === 'success' ? 'app__error-modal--success' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="app__error-icon">
                {modalType === 'success' ? '🎉' : '⚠️'}
              </span>
              <h3 className="app__error-title">
                {modalType === 'success' ? 'İşlem Başarılı!' : 'Bir Sorun Var'}
              </h3>
              <p className="app__error-text">{error}</p>
              
              {errorSolution && (
                <div className={`app__error-solution ${modalType === 'success' ? 'app__error-solution--success' : ''}`}>
                  <strong>💡 {modalType === 'success' ? 'Sonraki Adım: ' : 'Çözüm: '}</strong>{errorSolution}
                </div>
              )}
              
              {errorDetails && (
                <div className="app__error-details-wrapper">
                  <button 
                    className="app__error-details-toggle" 
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                  >
                    {showErrorDetails ? 'Detayları Gizle ▲' : 'Hata Detayları ▼'}
                  </button>
                  {showErrorDetails && (
                    <div className="app__error-logs-container">
                      <button 
                        className="app__error-copy-btn" 
                        onClick={handleCopyLogs}
                      >
                        {isCopied ? 'Kopyalandı!' : 'Kopyala'}
                      </button>
                      <pre className="app__error-logs">{errorDetails}</pre>
                    </div>
                  )}
                </div>
              )}

              <button 
                className="app__error-close" 
                onClick={() => {
                  setError('');
                  setErrorSolution('');
                  setErrorDetails('');
                  setShowErrorDetails(false);
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Yükleme Animasyonu */}
        {isLoading && (
          <div className="app__loading" id="loading-indicator">
            <div className="app__loading-pulse" />
            <p className="app__loading-text">Playlist taranıyor...</p>
          </div>
        )}

        {/* Sonuçlar */}
        {hasResults && (
          <>
            <div className="app__results-layout">
              <aside className="app__results-sidebar">
                <button
                  className="app__reset-btn"
                  id="scan-again-button"
                  onClick={() => {
                    setMatchedTracks([]);
                    setStats(null);
                    setCurrentPlaylistId(null);
                    setError('');
                    setErrorSolution('');
                    setErrorDetails('');
                  }}
                >
                  ← BİR PLAYLİST DAHA TARA
                </button>
                <ScoreCard stats={stats} />
              </aside>
              <div className="app__results-content">
                <TrackList
                  tracks={matchedTracks}
                  canRemove={canRemove}
                  onRemoveBoycotted={handleRemoveBoycotted}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Ne Mutlu Türk'üm Diyene!
          <img 
            src="https://flagcdn.com/w160/tr.png" 
            alt="Türk Bayrağı" 
            style={{ 
              height: '14px', 
              verticalAlign: 'middle', 
              marginLeft: '8px',
              borderRadius: '1px',
              boxShadow: '0 0 2px rgba(0,0,0,0.5)'
            }} 
          />
        </p>
      </footer>
    </div>
  );
}
