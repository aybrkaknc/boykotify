/**
 * App - Ana Uygulama Bileşeni
 * 
 * Boykotify uygulamasının kök bileşeni.
 * Spotify OAuth akışını, playlist taramayı ve sonuç gösterimini yönetir.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import AudioController from './components/AudioController/AudioController';
import PlaylistInput from './components/PlaylistInput/PlaylistInput';
import ScoreCard from './components/ScoreCard/ScoreCard';
import TrackList from './components/TrackList/TrackList';
import BoycottMarquee from './components/BoycottMarquee/BoycottMarquee';
import PlaylistPicker from './components/PlaylistPicker/PlaylistPicker';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import {
  loginWithSpotify,
  exchangeCodeForToken,
  getAccessToken,
  logoutSpotify,
  fetchPlaylistTracks,
  removeTracksFromPlaylist,
  fetchUserProfile,
  extractPlaylistId,
  fetchPlaylistMetadata,
  checkPlaylistAccessibility,
  fetchUserPlaylists
} from './services/spotify';
import {
  fetchAllEntities,
  matchTracksWithEntities,
  calculatePatriotScore
} from './services/boycott';
import RippleEffect from './components/RippleEffect/RippleEffect';
import './App.css';

const LOADING_MESSAGES = [
  "Terör Seviciler Ayıklanıyor...",
  "Kandil Senfonisi Susturuluyor...",
  "Milli Bilinç Sorgulanıyor...",
  "Hainlerin İzleri Sürülüyor...",
  "Gayrimilli Unsurlar Taranıyor...",
  "Kandil'in Sesi Kısılıyor...",
  "Fistanlı Notalar Ayıklanıyor...",
  "Pensilvanya Kayıtları Siliniyor...",
  "Foncu 'Sanatçılar' Radara Yakalandı...",
  "Mağara Melodileri Temizleniyor...",
  "Milli Menfaatler Gözetiliyor...",
  "İhanet Şebekesi Deşifre Ediliyor...",
  "Kripto Notalar Ayıklanıyor...",
  "Dış Mihrakların İzleri Siliniyor...",
  "Sözde Aydınların Ses Kayıtları Taranıyor...",
  "Milli Refleks Devrede...",
  "Hainlerin Playlisti Sorgulanıyor...",
  "Baronların Çarkına Çomak Sokuluyor...",
  "Güdümlü Şarkılar Tespit Ediliyor...",
  "Vatan Toprağı (Playlist) Arındırılıyor...",
  "Milli Çizgiden Sapanlar Listeleniyor...",
  "Sınır Ötesi Tarama Başlatıldı...",
  "Terör Finansörlerinin Maskesi Düşürülüyor...",
  "Hainlere Geçit Yok...",
  "Operasyon Başladı: Playlist Temizliği...",
  "Milli İradenin Sesi Yükseliyor...",
  "Kandil'e Nota Veriliyor...",
  "Yetmez Ama Evet Diyen Foncular Taranıyor...",
  "Liberal Maskeli İhanet Şebekesi Ayıklanıyor...",
  "Referandum İşbirlikçileri Radara Yakalandı...",
  "Türkçe Olimpiyatları Kayıtları Siliniyor...",
  "Maklube Kokulu Şarkılar Temizleniyor...",
  "Himmet Melodileri Engelleniyor...",
  "Okyanus Ötesinden Gelen Notalar İptal...",
  "Hizmet Maskeli Hainler Deşifre Ediliyor...",
  "Pensilvanya'nın Sesi Kesiliyor...",
  "Kripto FETÖ'cü Şarkıcılar Ayıklanıyor...",
  "Sözde Özgürlükçü Notalar Ayıklanıyor...",
  "Bölücü Sloganlar Playlist'ten Atılıyor...",
  "Kadın Hakları Maskesi Altındaki Hainler Taranıyor...",
  "Etnik Fitne Melodileri Deşifre Ediliyor..."
];

const BackgroundScroll = () => {
  const lines = Array.from({ length: 24 });
  return (
    <div className="app-background-scroll">
      {lines.map((_, i) => (
        <div key={i} className={`app-background-line line-${i % 2 === 0 ? 'right' : 'left'}`}>
          <div className="app-background-text">
            {"NE MUTLU TÜRK'ÜM DİYENE! ".repeat(10)}
          </div>
          <div className="app-background-text">
            {"NE MUTLU TÜRK'ÜM DİYENE! ".repeat(10)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [scanningCovers, setScanningCovers] = useState([]);
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mouse takibi
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll takibi
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        if (!isHeaderScrolled) setIsHeaderScrolled(true);
      } else {
        if (isHeaderScrolled) setIsHeaderScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeaderScrolled]);

  /**
   * Sayfa yüklendiğinde OAuth callback'ini, mevcut oturumu ve veritabanını kontrol eder.
   */
  useEffect(() => {
    handleAuthCallback();
    checkExistingSession();
    loadAllEntities();
    restoreResults();
  }, []);

  /**
   * localStorage'dan sonuçları geri yükler.
   * Eğer kayıtlı bir playlistId varsa, önce eski verileri gösterir,
   * ardından arka planda Spotify'dan taze veri çekerek günceller.
   * Böylece Spotify üzerinden yapılan değişiklikler (ekleme/çıkarma)
   * sayfa yenilendiğinde otomatik olarak yansır.
   */
  async function restoreResults() {
    try {
      const savedTracks = localStorage.getItem('boykotify_matched_tracks');
      const savedStats = localStorage.getItem('boykotify_stats');
      const savedPlaylistId = localStorage.getItem('boykotify_playlist_id');

      if (savedTracks && savedStats && savedPlaylistId) {
        /* Önce eski verileri anında göster (kullanıcı boş ekrana bakmasın) */
        setMatchedTracks(JSON.parse(savedTracks));
        setStats(JSON.parse(savedStats));
        setCurrentPlaylistId(savedPlaylistId);

        /* Arka planda taze veri çek ve güncelle */
        const token = getAccessToken();
        if (token) {
          try {
            const [{ tracks, info: playlistInfo }, entities] = await Promise.all([
              fetchPlaylistTracks(savedPlaylistId),
              fetchAllEntities()
            ]);

            const matched = matchTracksWithEntities(tracks, entities);
            const score = calculatePatriotScore(matched);
            score.playlistInfo = playlistInfo;

            setAllEntities(entities);

            const sortedMatched = matched.sort((a, b) => {
              if (a.status === 'boycott' && b.status !== 'boycott') return -1;
              if (b.status === 'boycott' && a.status !== 'boycott') return 1;
              return 0;
            });

            setMatchedTracks(sortedMatched);
            setStats(score);
          } catch (refreshErr) {
            /* API hatası olursa cache'deki eski veriler korunur, sessizce devam et */
            console.warn('Arka plan tazeleme başarısız, cache kullanılıyor:', refreshErr);
          }
        }
      }
    } catch (err) {
      console.error('Veriler geri yüklenemedi:', err);
    }
  }

  /**
   * Sonuçlar değiştikçe localStorage'ı günceller.
   */
  useEffect(() => {
    if (matchedTracks.length > 0 && stats && currentPlaylistId) {
      localStorage.setItem('boykotify_matched_tracks', JSON.stringify(matchedTracks));
      localStorage.setItem('boykotify_stats', JSON.stringify(stats));
      localStorage.setItem('boykotify_playlist_id', currentPlaylistId);
    }
  }, [matchedTracks, stats, currentPlaylistId]);

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

      /* Profil yüklendikten sonra playlistleri de çek */
      const playlists = await fetchUserPlaylists();
      setUserPlaylists(playlists);
    } catch (err) {
      console.error('Profil veya playlistler yüklenemedi:', err);
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
    setActiveFilter('all');
    localStorage.removeItem('boykotify_matched_tracks');
    localStorage.removeItem('boykotify_stats');
    localStorage.removeItem('boykotify_playlist_id');
  }

  /**
   * Playlist tarama işlemini başlatır.
   * Spotify API'den şarkıları çeker ve boykot veritabanıyla eşleştirir.
   * 
   * @param {string} playlistId - Taranacak playlist ID'si.
   */
  const handleScanPlaylist = useCallback(async (playlistUrlOrId) => {
    /* 1. Reset State & UI */
    setIsPickerOpen(false); // Paneli kapat
    setError('');
    setErrorSolution('');
    setErrorDetails('');
    setModalType('error');
    setShowErrorDetails(false);

    try {
      /* 2. ÖN DOĞRULAMA (Pre-check) 
         Eğer gelen bir URL ise önce kontrol et, değilse (refresh durumu) ID olarak kabul et.
      */
      let playlistId = playlistUrlOrId;
      if (playlistUrlOrId.includes('spotify.com') || playlistUrlOrId.includes('spotify:')) {
        const playlistData = await checkPlaylistAccessibility(playlistUrlOrId);
        playlistId = playlistData.id;
      }

      /* 3. DOĞRULAMA BAŞARILI: Yükleme Ekranına Geç */
      setIsLoading(true);
      setMatchedTracks([]);
      setStats(null);
      setActiveFilter('all');
      setScanningCovers([]);
      setLoadingMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length));

      const messageInterval = setInterval(() => {
        setLoadingMessageIndex(prev => {
          let next;
          do {
            next = Math.floor(Math.random() * LOADING_MESSAGES.length);
          } while (next === prev && LOADING_MESSAGES.length > 1);
          return next;
        });
      }, 2500);

      /* 4. Tarama Operasyonu */
      const covers = await fetchPlaylistMetadata(playlistId);
      setScanningCovers(covers);

      await new Promise(resolve => setTimeout(resolve, 8000));

      const [{ tracks, info: playlistInfo }, entities] = await Promise.all([
        fetchPlaylistTracks(playlistId),
        fetchAllEntities()
      ]);

      clearInterval(messageInterval);

      const matched = matchTracksWithEntities(tracks, entities);
      const score = calculatePatriotScore(matched);
      score.playlistInfo = playlistInfo;

      setAllEntities(entities);

      const sortedMatched = matched.sort((a, b) => {
        if (a.status === 'boycott' && b.status !== 'boycott') return -1;
        if (b.status === 'boycott' && a.status !== 'boycott') return 1;
        return 0;
      });

      setMatchedTracks(sortedMatched);
      setStats(score);
      setCurrentPlaylistId(playlistId);
    } catch (err) {
      console.error('Tarama/Doğrulama hatası:', err);
      setIsLoading(false);
      setModalType('error');
      setError(err.message || 'Playlist bulunamadı veya taranırken bir sorun oluştu.');

      /* Hata tipine göre akıllı çözüm önerisi */
      if (err.message.includes('ALBÜM') || err.message.includes('SANATÇI') || err.message.includes('ŞARKI')) {
        setErrorSolution('Spotify uygulamasında çalma listesinin üzerindeki üç noktaya tıklayın, "Paylaş" menüsünden "Link kopyala" seçeneğini kullanın.');
      } else if (err.message.includes('Gizli')) {
        setErrorSolution('Spotify uygulamasında çalma listesi ayarlarına girin ve "Herkese Açık Yap" (Make Public) seçeneğini işaretleyin.');
      } else if (err.message.includes('bulunamadı')) {
        setErrorSolution('Linkin sonundaki ekstra karakterleri silmiş olabilirsiniz. Linki Spotify üzerinden tekrar kopyalayıp yapıştırmayı deneyin.');
      } else {
        setErrorSolution('Yardım ( ? ) menüsündeki link gereksinimlerini kontrol edin.');
      }

      setErrorDetails(err.stack || err.message);
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
    <div className="app" id="app-root">
      <RippleEffect />
      <BackgroundScroll />
      {/* Alt Bilgi — Yapay Zeka Uyarı ve Geri Dönüş */}
      <div className="app__footer-info">
        Bu veri tabanı yapay zeka yardımıyla oluşturulmuştur. Lütfen KÜFRETMEDEN ÖNCE, yanlış veya eksik bilgiler için <a href="mailto:ayberk.akinci.temp@gmail.com">geri dönüş</a> sağlayın.
      </div>

      {/* Sol Kenar — Sonsuz Kayan Sanatçı Listesi */}
      <BoycottMarquee entities={allEntities} />

      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isScrolled={user && isHeaderScrolled}
        isPickerOpen={isPickerOpen}
        onTogglePicker={() => setIsPickerOpen(!isPickerOpen)}
        onManualInput={() => setShowManualInput(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasPlaylists={userPlaylists && userPlaylists.length > 0}
      />



      <main className={`app__main ${isPickerOpen ? 'app__main--picker-open' : ''}`}>
        {/* Karşılama Bölümü */}
        {!hasResults && !isLoading && (
          <>
            <section className={`app__hero animate-fade-in ${isPickerOpen ? 'app__hero--hidden' : ''}`} id="hero-section">
              <div className="app__hero-content">
                <h2 className="app__hero-title">
                  <span className="app__hero-line hero-line-1">MÜZİĞİNDE</span>
                  <a
                    href="https://www.youtube.com/playlist?list=PLCeSne8xqy-CaTlFHHzkrRA7bMASJCpSW"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app__hero-accent app__hero-link app__hero-line hero-line-2"
                  >İHANETE</a>
                  <span className="app__hero-line hero-line-3">İZİN VERME!</span>
                </h2>

                {!user && (
                  <button
                    className="app__hero-login-btn btn-sonar"
                    onClick={handleLogin}
                    id="hero-login-button"
                  >
                    <div className="btn-shine"></div>
                    <span className="btn-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </span>
                    <div className="btn-text-content">
                      <span className="btn-label">Spotify ile Giriş Yap</span>
                    </div>
                  </button>
                )}
              </div>
            </section>

            {user && !showManualInput && (
              <PlaylistPicker
                playlists={userPlaylists}
                onSelect={handleScanPlaylist}
                onManualInput={() => setShowManualInput(true)}
                isPickerOpen={isPickerOpen}
                onTogglePicker={() => setIsPickerOpen(!isPickerOpen)}
                viewMode={viewMode}
              />
            )}

            {user && showManualInput && (
              <div className="app__manual-input-wrapper">
                <PlaylistInput onSubmit={handleScanPlaylist} isLoading={isLoading} />
                <button
                  className="app__picker-back-btn"
                  onClick={() => setShowManualInput(false)}
                >
                  ← Listelerime Geri Dön
                </button>
              </div>
            )}
          </>
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

        {/* Gelişmiş Yükleme Ekranı (Madde 3) */}
        {isLoading && (
          <div className="app__loading animate-fade-in" id="loading-indicator">
            <div className="app__loading-collage">
              {/* Gerçek kapak fotoğraflarını kullanarak kolaj oluştur */}
              {(scanningCovers.length > 0 ? [...Array(100)].map((_, i) => scanningCovers[i % scanningCovers.length]) : []).map((url, i) => (
                <div
                  key={i}
                  className="app__collage-item"
                  style={{
                    backgroundImage: `url(${url})`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            <div className="app__loading-overlay" />

            <div className="app__radar-container">
              <div className="app__radar-circle"></div>
              <div className="app__radar-circle"></div>
              <div className="app__radar-circle"></div>
              <div className="app__radar-circle"></div>

              <div className="app__loading-text-wrapper">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={loadingMessageIndex}
                    className="app__loading-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {LOADING_MESSAGES[loadingMessageIndex]}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Sonuçlar */}
        {hasResults && (
          <div className="animate-fade-in">
            <div className="app__results-layout">
              <aside className="app__results-sidebar">
                <button
                  className="app__reset-btn"
                  id="scan-again-button"
                  onClick={() => {
                    setMatchedTracks([]);
                    setStats(null);
                    setCurrentPlaylistId(null);
                    setActiveFilter('all');
                    setError('');
                    setErrorSolution('');
                    setErrorDetails('');
                    localStorage.removeItem('boykotify_matched_tracks');
                    localStorage.removeItem('boykotify_stats');
                    localStorage.removeItem('boykotify_playlist_id');
                  }}
                >
                  ← BİR PLAYLİST DAHA
                </button>
                <div className="desktop-scoreboard-wrapper">
                  <ScoreCard
                    stats={stats}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>
              </aside>
              <div className="app__results-content">
                <TrackList
                  tracks={matchedTracks}
                  activeFilter={activeFilter}
                  canRemove={canRemove}
                  onRemoveBoycotted={handleRemoveBoycotted}
                  onRefresh={() => handleScanPlaylist(currentPlaylistId)}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Mobil Sticky Bottom Scoreboard */}
            <div className="app__mobile-scoreboard-wrapper">
              <ScoreCard
                stats={stats}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="app__footer">
      </footer>
      <ScrollToTop show={isHeaderScrolled} />
    </div>
  );
}
