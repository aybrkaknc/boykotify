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

export default function ScoreCard({ stats }) {
  if (!stats) return null;

  const { score, total, boycottCount, patrioticCount, unknownCount, playlistInfo } = stats;

  /**
   * Skora göre durum metnini belirler.
   * @param {number} score - Vatanseverlik skoru.
   * @returns {string} - Durum açıklaması.
   */
  function getScoreLabel(score) {
    if (score >= 80) return 'Vatansever Playlist!';
    if (score >= 50) return 'İyiye Gidiyor';
    if (score >= 20) return 'Temizlik Gerekli';
    return 'Acil Müdahale!';
  }

  /**
   * Skora göre renk sınıfını belirler.
   * @param {number} score - Vatanseverlik skoru.
   * @returns {string} - CSS modifier sınıfı.
   */
  function getScoreModifier(score) {
    if (score >= 80) return 'score-card--high';
    if (score >= 50) return 'score-card--medium';
    return 'score-card--low';
  }

  return (
    <section className={`score-card ${getScoreModifier(score)}`} id="score-card">
      {playlistInfo && (
        <div className="score-card__playlist">
          <h4 className="score-card__playlist-name">{playlistInfo.name}</h4>
          <p className="score-card__playlist-owner">Oluşturan: {playlistInfo.owner}</p>
        </div>
      )}

      <div className="score-card__value">
        <span className="score-card__number">%{score}</span>
      </div>

      <div className="score-card__info">
        <h3 className="score-card__label">{getScoreLabel(score)}</h3>
      </div>

      <div className="score-card__metrics">
        <div className="score-card__metric">
          <span className="score-card__metric-value">{total}</span>
          <span className="score-card__metric-label">Toplam</span>
        </div>
        <div className="score-card__metric score-card__metric--boycott">
          <span className="score-card__metric-value">{boycottCount}</span>
          <span className="score-card__metric-label">Boykotlu</span>
        </div>
        <div className="score-card__metric score-card__metric--patriotic">
          <span className="score-card__metric-value">{patrioticCount}</span>
          <span className="score-card__metric-label">Vatansever</span>
        </div>
        <div className="score-card__metric">
          <span className="score-card__metric-value">{unknownCount}</span>
          <span className="score-card__metric-label">Alakasız</span>
        </div>
      </div>
    </section>
  );
}
