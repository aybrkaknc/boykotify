import React, { useState, useEffect } from 'react';
import './EntityTable.css';

/**
 * Veritabanındaki sanatçı ve firmaları listeleyen tablo bileşeni.
 * 
 * @param {Object} props
 * @param {Array} props.entities - Gösterilecek sanatçı/firma listesi.
 */
const EntityTable = ({ entities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntities, setFilteredEntities] = useState(entities);

  useEffect(() => {
    const results = entities.filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntities(results);
  }, [searchTerm, entities]);

  return (
    <div className="entity-table-container">
      <div className="entity-table-header">
        <h2>Sanatçı & Firma Veritabanı</h2>
        <div className="search-wrapper">
          <input
            type="text"
            className="entity-search"
            placeholder="İsim veya neden ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="entity-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Tür</th>
              <th>Durum</th>
              <th>Gerekçe</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntities.length > 0 ? (
              filteredEntities.map((entity) => (
                <tr key={entity.id}>
                  <td style={{ fontWeight: 'bold', color: 'white' }}>{entity.name}</td>
                  <td>{entity.type === 'artist' ? 'Sanatçı' : 'Firma'}</td>
                  <td>
                    <span className={`status-badge ${entity.status}`}>
                      {entity.status === 'boycott' ? 'BOYKOT' : 'VATANSEVER'}
                    </span>
                  </td>
                  <td className="reason-cell">
                    {entity.reason || 'Gerekçe belirtilmemiş.'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                  Aramanızla eşleşen kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityTable;
