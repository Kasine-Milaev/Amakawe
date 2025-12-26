// src/pages/BrowseAll.jsx
import React, { useState, useEffect } from 'react';
import CatalogCard from '../components/Catalog/CatalogCard';
import { getNewAnime, getAnimeByType, getAnimeByGenre, searchAnime } from '../services/animeService';
import { useNavigate } from 'react-router-dom';

const BrowseAll = ({ filterType, filterValue }) => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // При изменении фильтров сбрасываем пагинацию и загружаем заново
    setPage(1);
    setHasMore(true);
    fetchAnime(1);
  }, [filterType, filterValue]);

  const fetchAnime = async (pageNumber) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data = [];
      
      if (filterType === 'new') {
        // Для новых аниме
        const currentYear = new Date().getFullYear();
        data = await searchAnime('', { 
          order: 'aired_on', 
          limit: 50, 
          year: currentYear,
          page: pageNumber
        });
      } else if (filterType === 'kind') {
        // Для типов: tv, movie, ova, ona
        data = await getAnimeByType(filterValue, pageNumber, 50);
      } else if (filterType === 'genre') {
        // Для жанров
        data = await getAnimeByGenre(filterValue, pageNumber, 50);
      } else {
        // По умолчанию - популярное
        data = await searchAnime('', { 
          order: 'popularity', 
          limit: 50, 
          page: pageNumber 
        });
      }
      
      // Проверяем, есть ли еще данные для следующей страницы
      if (data.length === 0 || data.length < 50) {
        setHasMore(false);
      }
      
      // Если первая страница, устанавливаем новые данные, иначе добавляем к существующим
      if (pageNumber === 1) {
        setAnimeList(data);
      } else {
        setAnimeList(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error('Ошибка при загрузке аниме:', err);
      setError('Не удалось загрузить аниме. Попробуйте позже.');
      if (pageNumber === 1) {
        setAnimeList([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (filterType) {
      case 'kind':
        if (filterValue === 'tv') return 'Все аниме сериалы';
        if (filterValue === 'movie') return 'Все полнометражные фильмы';
        if (filterValue === 'ova') return 'Все OVA';
        if (filterValue === 'ona') return 'Все ONA';
        return `Все аниме (${filterValue})`;
      case 'new':
        return 'Последние обновления и новые аниме';
      case 'genre':
        return `Аниме по жанру: ${filterValue}`;
      default:
        return 'Популярное аниме';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchAnime(page + 1);
    }
  };

  // Эффект для бесконечного скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 200 >= 
          document.documentElement.offsetHeight) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  if (error) {
    return (
      <div className="browse-all-page">
        <div className="page-header">
          <button onClick={handleBack} className="button-incan back-button">
            ← Назад
          </button>
          <h1>{getTitle()}</h1>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => fetchAnime(1)} className="button-incan retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-all-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>{getTitle()}</h1>
      </div>
      
      {loading && page === 1 ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      ) : animeList.length === 0 ? (
        <div className="no-results">
          {page === 1 ? (
            <>
              <p>Аниме не найдено.</p>
              <p>Попробуйте изменить фильтры или вернуться назад.</p>
            </>
          ) : (
            <p>Больше нет аниме для отображения</p>
          )}
        </div>
      ) : (
        <div className="catalog-grid browse-all-grid">
          {animeList.map((title) => (
            <CatalogCard key={title.id} title={title} />
          ))}
        </div>
      )}
      
      {loading && page > 1 && (
        <div className="loading-more">
          <div className="spinner"></div>
          <p>Загрузка еще...</p>
        </div>
      )}
      
      {!loading && hasMore && (
        <div className="load-more-container">
          <button onClick={loadMore} className="button-incan load-more-button">
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseAll;