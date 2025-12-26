// src/pages/AnimeList.jsx
import React, { useState, useEffect } from 'react';
import CatalogCard from '../components/Catalog/CatalogCard';
import { searchAnime } from '../services/animeService';
import Filters from '../components/Search/Filters';
import { useNavigate } from 'react-router-dom';

const AnimeList = ({ isSearchVisible, toggleSearch }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState('popularity');
  const navigate = useNavigate();

  // Загрузка аниме при изменении страницы, фильтров или сортировки
  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchAnime('', {
          ...activeFilters,
          limit: 40,
          page: currentPage,
          order: sortOption
        });
        
        setAnimeList(prev => currentPage === 1 ? data : [...prev, ...data]);
        
        // Устанавливаем общее количество страниц (примерное)
        if (currentPage === 1 && data.length > 0) {
          setTotalPages(Math.ceil(1000 / 40)); // Примерное значение, можно уточнить
        }
      } catch (err) {
        setError('Не удалось загрузить список аниме. Попробуйте позже.');
        console.error('Ошибка при загрузке аниме:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage, activeFilters, sortOption]);

  // Обработка применения фильтров
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  // Обработка сортировки
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  // Обработка бесконечного скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 200 >= 
          document.documentElement.offsetHeight && 
          !loading && 
          currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, currentPage, totalPages]);

  const handleAnimeClick = (anime) => {
  navigate(`/anime/${anime.id}`);
};

  if (error && animeList.length === 0) {
    return (
      <div className="anime-list-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="button-incan">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-list-page">
      <div className="page-header">
        <h1>Все аниме</h1>
        <div className="header-actions">
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="popularity">По популярности</option>
            <option value="ranked">По рейтингу</option>
            <option value="aired_on">По дате выхода</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>

      <div className="filters-section">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {loading && currentPage === 1 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка аниме...</p>
        </div>
      ) : (
        <>
          <div className="anime-grid">
            {animeList.map((anime) => (
              <div 
                key={anime.id} 
                onClick={() => handleAnimeClick(anime)}
                className="anime-card-wrapper"
              >
                <CatalogCard title={anime} />
              </div>
            ))}
          </div>

          {loading && currentPage > 1 && (
            <div className="loading-more">
              <div className="spinner"></div>
              <p>Загрузка еще...</p>
            </div>
          )}

          {!loading && animeList.length === 0 && (
            <div className="no-results">
              <p>Аниме не найдено. Попробуйте изменить фильтры.</p>
            </div>
          )}

          {!loading && currentPage < totalPages && animeList.length > 0 && (
            <div className="load-more-container">
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                className="button-incan load-more-button"
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnimeList;