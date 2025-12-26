// src/pages/ONAPage.jsx
import React, { useState, useEffect } from 'react';
import { searchAnime } from '../services/animeService';
import AnimeSection from '../components/AnimeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ONAPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadONA();
  }, []);

  const loadONA = async () => {
    try {
      setLoading(true);
      // ONA (Original Net Animation)
      const ona = await searchAnime('', {
        kind: 'ona',
        limit: 50,
        order: 'popularity'
      });
      setAnimeList(ona);
    } catch (error) {
      console.error('Ошибка загрузки ONA:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page ona-page">
      <div className="page-header">
        <h1>ONA (Original Net Animation)</h1>
        <p>Аниме, созданные специально для интернет-распространения</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length > 0 ? (
        <AnimeSection
          title="Все ONA-релизы"
          animeList={animeList}
          showViewAll={false}
        />
      ) : (
        <div className="no-results">
          <p>ONA не найдены</p>
        </div>
      )}
    </div>
  );
};

export default ONAPage;