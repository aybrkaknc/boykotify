/**
 * ScoreCard Bileşeni
 * 
 * Vatanseverlik skorunu ve istatistikleri görsel olarak sunar.
 * Dairesel skor göstergesi ve alt metrikler içerir.
 * 
 * @param {Object} props
 * @param {Object} props.stats - Skor ve istatistik verileri.
 * @param {number} props.stats.score - Vatanseverlik skoru (0-100).
 * @param {number} props.stats.total - Toplam şarkı sayısı.
 * @param {number} props.stats.boycottCount - Boykotlu şarkı sayısı.
 * @param {number} props.stats.patrioticCount - Vatansever şarkı sayısı.
 * @param {number} props.stats.unknownCount - Alakasız şarkı sayısı.
 */
import './ScoreCard.css';

export default function ScoreCard({ stats, activeFilter = 'all', onFilterChange }) {
  if (!stats) return null;

  const { score, total, boycottCount, patrioticCount, unknownCount, playlistInfo } = stats;

  /**
   * Skora göre durum metnini belirler.
   */
  function getScoreLabel(score) {
    if (score >= 80) return 'Vatansever Playlist!';
    if (score >= 50) return 'İyiye Gidiyor';
    if (score >= 20) return 'Temizlik Gerekli';
    return 'Acil Müdahale!';
  }

  /**
   * Skora göre renk sınıfını belirler.
   */
  function getScoreModifier(score) {
    if (score >= 80) return 'score-card--high';
    if (score >= 50) return 'score-card--medium';
    return 'score-card--low';
  }

  const handleFilter = (key) => {
    if (onFilterChange) onFilterChange(key);
  };

  return (
    <section className={`score-card ${getScoreModifier(score)}`} id="score-card">
      {playlistInfo && (
        <div className="score-card__playlist">
          <h4 className="score-card__playlist-name">{playlistInfo.name}</h4>
          <p className="score-card__playlist-owner">Oluşturan: {playlistInfo.owner}</p>
        </div>
      )}

      <div className="score-card__value">
        <span className="score-card__number">%{Number.isInteger(score) ? score : score.toFixed(2)}</span>
      </div>

      <div className="score-card__info">
        <h3 className="score-card__label">{getScoreLabel(score)}</h3>
      </div>

      <div className="score-card__metrics">
        <button 
          className={`score-card__metric score-card__metric--all ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilter('all')}
        >
          <span className="score-card__metric-value">{total}</span>
          <span className="score-card__metric-label">Tümü</span>
        </button>
        
        <button 
          className={`score-card__metric score-card__metric--boycott ${activeFilter === 'boycott' ? 'active' : ''}`}
          onClick={() => handleFilter('boycott')}
        >
          <span className="score-card__metric-value">{boycottCount}</span>
          <span className="score-card__metric-label">Boykotlu</span>
        </button>
        
        <button 
          className={`score-card__metric score-card__metric--patriotic ${activeFilter === 'patriotic' ? 'active' : ''}`}
          onClick={() => handleFilter('patriotic')}
        >
          <span className="score-card__metric-value">{patrioticCount}</span>
          <span className="score-card__metric-label">Vatansever</span>
        </button>
        
        <button 
          className={`score-card__metric score-card__metric--unknown ${activeFilter === 'unknown' ? 'active' : ''}`}
          onClick={() => handleFilter('unknown')}
        >
          <span className="score-card__metric-value">{unknownCount}</span>
          <span className="score-card__metric-label">Alakasız</span>
        </button>
      </div>
    </section>
  );
}
