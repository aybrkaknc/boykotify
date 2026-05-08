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

  if (marqueeItems.length === 0) return null;

  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse ile sürükleme (PC) için eventler
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Sürükleme hızı çarpanı
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  // JS tabanlı otomatik kaydırma (Auto-scroll) - Sürükleme yokken çalışır
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft += 1; // Hızı buradan ayarlayabiliriz
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <aside
      className="marquee-sidebar"
      style={{ '--marquee-duration': `${duration}s` }}
      aria-hidden="true"
    >
      <div 
        className={`marquee-track ${isDragging ? 'dragging' : ''}`}
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
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
            >
              {entity.name}
            </Tag>
          );
        })}
      </div>
    </aside>
  );
};

export default BoycottMarquee;
