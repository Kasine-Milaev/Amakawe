// src/components/Search/Filters.jsx
import React, { useState, useEffect } from 'react';

const Filters = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [year, setYear] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isYearValid, setIsYearValid] = useState(true);

  const genres = [
    'Сейнен', 'Вампиры', 'Космос', 'Перевоплотился',
    'Сёдзё', 'Военное', 'Магия', 'Психологическое',
    'Комедия', 'Гарем', 'Машины', 'Самураи',
    'Романтика', 'Демоны', 'Меха', 'Сверхъестественное',
    'Школа', 'Детектив', 'Музыка', 'Спорт',
    'Безумие', 'Драма', 'Пародия',
    'Драки', 'Новые игры', 'Повседневность', 'Ужасы'
  ];

  const types = [
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Фильм' },
    { value: 'ova', label: 'OVA' },
    { value: 'ona', label: 'ONA' }
  ];

  const statuses = [
    { value: 'released', label: 'Вышло' },
    { value: 'ongoing', label: 'Онгоинг' }
  ];

  // При изменении любого фильтра обновляем родительский компонент
  useEffect(() => {
    // Проверяем валидность года
    const yearInt = parseInt(year);
    const currentYear = new Date().getFullYear();
    const isValid = !year || (yearInt >= 1963 && yearInt <= currentYear);
    setIsYearValid(isValid);
    
    onFilterChange({ 
      type: selectedType, 
      status: selectedStatus, 
      year: isValid ? year : '',
      genres: selectedGenres 
    });
  }, [selectedType, selectedStatus, year, selectedGenres]);

  const handleTypeClick = (type) => {
    setSelectedType(prev => prev === type ? '' : type);
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(prev => prev === status ? '' : status);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setYear(value);
  };

  return (
    <div className="filters-container">
      <div className="filter-section">
        <h3 className="filter-title">Тип</h3>
        <div className="filter-buttons">
          {types.map((type) => (
            <button
              key={type.value}
              className={`filter-button ${selectedType === type.value ? 'active' : ''}`}
              onClick={() => handleTypeClick(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Статус</h3>
        <div className="filter-buttons">
          {statuses.map((status) => (
            <button
              key={status.value}
              className={`filter-button ${selectedStatus === status.value ? 'active' : ''}`}
              onClick={() => handleStatusClick(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Год</h3>
        <input
          type="number"
          min="1963"
          max={new Date().getFullYear()}
          value={year}
          onChange={handleYearChange}
          placeholder="1963-2025"
          className={`filter-year-input ${!isYearValid ? 'invalid' : ''}`}
        />
        {!isYearValid && year && (
          <div className="filter-error">Год должен быть между 1963 и {new Date().getFullYear()}</div>
        )}
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Жанры</h3>
        <div className="genre-buttons">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-button ${selectedGenres.includes(genre) ? 'active' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;