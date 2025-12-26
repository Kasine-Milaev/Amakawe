// src/pages/OVAPage.jsx
import React, { useState, useEffect } from 'react';
import { searchAnime } from '../services/animeService';
import AnimeSection from '../components/AnimeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OVAPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOVA();
  }, []);

  const loadOVA = async () => {
    try {
      setLoading(true);
      // OVA (Original Video Animation)
      const ova = await searchAnime('', {
        kind: 'ova',
        limit: 50,
        order: 'popularity'
      });
      setAnimeList(ova);
    } catch (error) {
      console.error('Ошибка загрузки OVA:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page ova-page">
      <div className="page-header">
        <h1>OVA (Original Video Animation)</h1>
        <p>Выпуски, изначально созданные для домашнего просмотра</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length > 0 ? (
        <AnimeSection
          title="Все OVA-релизы"
          animeList={animeList}
          showViewAll={false}
        />
      ) : (
        <div className="no-results">
          <p>OVA не найдены</p>
        </div>
      )}
    </div>
  );
};

export default OVAPage;