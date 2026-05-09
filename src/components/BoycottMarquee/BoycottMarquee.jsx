import React, { useMemo, useRef, useState, useEffect } from 'react';
import './BoycottMarquee.css';

/**
 * BoycottMarquee - Sayfanın sol kenarında dikey olarak sonsuz döngüde kayan sanatçı isimleri.
 * 
 * Liste iki kez tekrarlanarak seamless (kesintisiz) bir döngü sağlanır.
 * translateY(-50%) animasyonu ile ilk kopya yukarı kayarken ikinci kopya devreye girer.
 *
 * @param {Object} props
 * @param {Array} props.entities - Veritabanındaki sanatçı/firma listesi.
 */
const BoycottMarquee = ({ entities }) => {
  /**
   * Sadece isim ve durumu içeren hafif bir liste oluşturur.
   * Listeyi iki kez tekrarlayarak sonsuz döngü efekti sağlar.
   */
  const marqueeItems = useMemo(() => {
    if (!entities || entities.length === 0) return [];
    
    /* Sadece boykot durumunda olanları filtrele */
    const boycottedEntities = entities.filter(e => e.status === 'boycott');
    if (boycottedEntities.length === 0) return [];

    return [...boycottedEntities, ...boycottedEntities];
  }, [entities]);

  /** Sanatçı sayısına göre animasyon süresini dinamik ayarla (Reklam panosu gibi çok hızlı akması için) */
  const duration = useMemo(() => {
    const displayCount = marqueeItems.length / 2 || 1;
    // Her bir item için çok kısa bir süre (0.4sn) ayırıp toplam süreyi buluyoruz.
    return Math.max(5, displayCount * 0.4);
  }, [marqueeItems]);

  const trackRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [isHoveringTrack, setIsHoveringTrack] = useState(false);
  const [activeEntity, setActiveEntity] = useState(null);
  const [popupPos, setPopupPos] = useState(0);

  // JS tabanlı otomatik kaydırma (Auto-scroll) - Hover veya Popup yokken çalışır
  useEffect(() => {
    if (isHoveringTrack || activeEntity || marqueeItems.length === 0) return;
    
    const interval = setInterval(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft += 1;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isHoveringTrack, activeEntity, marqueeItems.length]);

  // Fare tekerleği ile yatay kaydırma
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (e) => {
      e.preventDefault(); 
      setActiveEntity(null); // Kaydırma yapınca popup'ı gizle
      
      track.scrollBy({
        left: (e.deltaY + e.deltaX) * 1.5,
        behavior: 'smooth'
      });
    };

    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => track.removeEventListener('wheel', handleWheel);
  }, [marqueeItems.length]); // Veriler yüklenip ref oluştuktan sonra çalışması için bağımlılık eklendi

  if (marqueeItems.length === 0) return null;

  const handleItemMouseEnter = (e, entity) => {
    // Mobilde (768px altı) popup gösterme
    if (window.innerWidth <= 768) return;

    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos(rect.left + rect.width / 2);
    setActiveEntity(entity);
  };

  const handleItemMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveEntity(null);
    }, 300); // Popup'a giderken kapanmaması için 300ms tölerans süresi
  };

  const handlePopupMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handlePopupMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveEntity(null);
    }, 300);
  };

  return (
    <>
      {/* Global Popup (Taşmaları önlemek için aside dışında) */}
      {activeEntity && (
        <div 
          className="marquee-global-popup" 
          style={{ left: popupPos }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div className="marquee-popup-header">
            <span className={`marquee-popup-status marquee-popup-status--${activeEntity.status}`}>
              {activeEntity.status === 'boycott' ? 'BOYKOT' : 'VATANSEVER'}
            </span>
            <span className="marquee-popup-entity">{activeEntity.name}</span>
          </div>
          {activeEntity.reason && (
            <p className="marquee-popup-reason">{activeEntity.reason}</p>
          )}
          {activeEntity.source_url && (
            <a 
              className="marquee-popup-source"
              href={activeEntity.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kaynak için tıkla →
            </a>
          )}
        </div>
      )}

      <aside
        className="marquee-sidebar iso-dial-mode"
        style={{ '--marquee-duration': `${duration}s` }}
        aria-hidden="true"
        onMouseEnter={() => setIsHoveringTrack(true)}
        onMouseLeave={() => setIsHoveringTrack(false)}
      >
        <div 
          className="marquee-track"
          ref={trackRef}
        >
          {marqueeItems.map((entity, index) => {
            const Tag = entity.source_url ? 'a' : 'span';
            return (
              <Tag
                key={`${entity.name}-${index}`}
                className={`marquee-item ${entity.status} ${entity.source_url ? 'clickable' : ''}`}
                href={entity.source_url || undefined}
                target={entity.source_url ? '_blank' : undefined}
                rel={entity.source_url ? 'noopener noreferrer' : undefined}
                onMouseEnter={(e) => handleItemMouseEnter(e, entity)}
                onMouseLeave={handleItemMouseLeave}
              >
                {entity.name}
              </Tag>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default BoycottMarquee;
