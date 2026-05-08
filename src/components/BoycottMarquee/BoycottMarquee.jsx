import React, { useMemo } from 'react';
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

  /** Sanatçı sayısına göre animasyon süresini dinamik ayarla (Yatay akış için daha hızlı) */
  const duration = useMemo(() => {
    const displayCount = marqueeItems.length / 2 || 1;
    return Math.max(15, displayCount * 5);
  }, [marqueeItems]);

  if (marqueeItems.length === 0) return null;

  return (
    <aside
      className="marquee-sidebar"
      style={{ '--marquee-duration': `${duration}s` }}
      aria-hidden="true"
    >
      <div className="marquee-track">
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
