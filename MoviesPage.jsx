// src/pages/MoviesPage.jsx
import React, { useState, useEffect } from 'react';
import { searchAnime } from '../services/animeService';
import AnimeSection from '../components/AnimeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MoviesPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      // Полнометражные фильмы (kind: 'movie')
      const movies = await searchAnime('', {
        kind: 'movie',
        limit: 50,
        order: 'popularity'
      });
      setAnimeList(movies);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page movies-page">
      <div className="page-header">
        <h1>Полнометражные фильмы</h1>
        <p>Аниме-фильмы с законченным сюжетом</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length > 0 ? (
        <AnimeSection
          title="Все фильмы"
          animeList={animeList}
          showViewAll={false}
        />
      ) : (
        <div className="no-results">
          <p>Фильмы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;