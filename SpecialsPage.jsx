// src/pages/SpecialsPage.jsx
import React, { useState, useEffect } from 'react';
import { searchAnime } from '../services/animeService';
import AnimeSection from '../components/AnimeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SpecialsPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecials();
  }, []);

  const loadSpecials = async () => {
    try {
      setLoading(true);
      // Specials (специальные выпуски)
      const specials = await searchAnime('', {
        kind: 'special',
        limit: 50,
        order: 'popularity'
      });
      setAnimeList(specials);
    } catch (error) {
      console.error('Ошибка загрузки спешлов:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page specials-page">
      <div className="page-header">
        <h1>Специальные выпуски</h1>
        <p>Особые эпизоды, OVA-спешлы и бонусные материалы</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length > 0 ? (
        <AnimeSection
          title="Все специальные выпуски"
          animeList={animeList}
          showViewAll={false}
        />
      ) : (
        <div className="no-results">
          <p>Специальные выпуски не найдены</p>
        </div>
      )}
    </div>
  );
};

export default SpecialsPage;