// src/pages/GenrePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { genresData } from '../data/genres';
import { searchAnime } from '../services/animeService';
import CatalogCard from '../components/Catalog/CatalogCard';
import { genreIdMapping } from '../data/genreMapping';

const GenrePage = () => {
  const { slug } = useParams();
  const [genre, setGenre] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const foundGenre = genresData.find(g => g.slug === slug);
    if (foundGenre) {
      setGenre(foundGenre);
      // Сбрасываем состояние при смене жанра
      setAnimeList([]);
      setPage(1);
      setLoading(true);
    } else {
      navigate('/genres');
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (genre) {
      loadAnimeList();
    }
  }, [genre, page]);

  const loadAnimeList = async () => {
    if (page === 1) {
      setLoading(true);
    }
    
    try {
      // Получаем ID жанра из маппинга
      const genreId = genreIdMapping[slug];
      
      if (!genreId) {
        console.warn(`ID жанра для "${slug}" не найден`);
        setAnimeList([]);
        setHasMore(false);
        return;
      }

      console.log(`Загрузка аниме для жанра ${genre.name} (ID: ${genreId}, slug: ${slug})`);
      
      // Ключевое изменение: передаем ID жанра в параметре 'genre'
      const anime = await searchAnime('', {
        genre: genreId, // Используем ID жанра, а не название
        limit: 20,
        page: page,
        order: 'ranked' // Меняем на 'ranked' для более релевантных результатов
      });
      
      console.log(`Получено ${anime.length} аниме для жанра ${genre.name}`);
      
      if (page === 1) {
        setAnimeList(anime);
      } else {
        setAnimeList(prev => [...prev, ...anime]);
      }
      
      // Проверяем, есть ли еще данные
      setHasMore(anime.length === 20);
    } catch (error) {
      console.error('Ошибка загрузки аниме:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.id}`);
  };

  if (!genre) {
    return (
      <div className="genre-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка жанра...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genre-page">
      <div className="genre-header-section">
        <div className="genre-header-content">
          <div className="genre-header-image">
            <div 
              className="genre-main-image"
              style={{ 
                backgroundImage: `url(${genre.image})`,
                backgroundColor: '#1e293b'
              }}
            />
          </div>
          
          <div className="genre-header-info">
            <h1 className="genre-title">{genre.name}</h1>
            <p className="genre-description-full">{genre.description}</p>
            
            <div className="genre-stats">
              <div className="stat-item">
                <span className="stat-value">{animeList.length}</span>
                <span className="stat-label">Аниме найдено</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">Рейтинг</span>
                <span className="stat-label">Сортировка</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="genre-anime-section">
        <h2>Аниме в жанре "{genre.name}"</h2>
        
        {loading && animeList.length === 0 ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Загрузка аниме...</p>
          </div>
        ) : animeList.length === 0 ? (
          <div className="no-results">
            <p>Аниме в этом жанре не найдено. Попробуйте другой жанр.</p>
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
            
            {hasMore && !loading && (
              <div className="load-more-container">
                <button 
                  className="button-incan load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  Загрузить еще
                </button>
              </div>
            )}
            
            {loading && animeList.length > 0 && (
              <div className="loading-more">
                <div className="spinner"></div>
                <p>Загрузка еще...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GenrePage;