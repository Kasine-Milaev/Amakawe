// src/pages/FiltersPage.jsx
import React, { useState } from 'react';

const FiltersPage = ({ onApplyFilters }) => {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');

  const genres = [
    'Сейнен', 'Вампиры', 'Космос', 'Перевоплотился',
    'Сёдзё', 'Военное', 'Магия', 'Психологическое',
    'Комедия', 'Гарем', 'Машины', 'Самураи',
    'Романтика', 'Демоны', 'Меха', 'Сверхъестественное',
    'Школа', 'Детектив', 'Музыка', 'Спорт',
    'Безумие', 'Драма', 'Пародия', 'Хентай',
    'Драки', 'Новые игры', 'Повседневность', 'Ужасы'
  ];

  const handleApply = () => {
    onApplyFilters({ type, status, year, genre });
  };

  return (
    <div className="filters-page" style={{ 
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Фильтры</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Тип:</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          >
            <option value="">Все</option>
            <option value="tv">TV</option>
            <option value="movie">Фильм</option>
            <option value="ova">OVA</option>
            <option value="ona">ONA</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Статус:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          >
            <option value="">Все</option>
            <option value="released">Вышло</option>
            <option value="ongoing">Онгоинг</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Год:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2025"
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', color: '#94a3b8', marginBottom: '5px' }}>Жанр:</label>
          <select 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px'
            }}
          >
            <option value="">Все</option>
            {genres.map((g, index) => (
              <option key={index} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleApply}
        style={{
          backgroundColor: 'transparent',
          color: '#ffde00',
          border: '1px solid #ffde00',
          padding: '8px 16px',
          borderRadius: '50px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontSize: '1rem'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 222, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
};

export default FiltersPage;