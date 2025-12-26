// src/pages/AnnouncementsPage.jsx
import React, { useState, useEffect } from 'react';
import { searchAnime } from '../services/animeService';
import AnimeSection from '../components/AnimeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AnnouncementsPage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      // Ищем анонсированные аниме (статус: "anons")
      const announcements = await searchAnime('', {
        status: 'anons',
        limit: 50,
        order: 'popularity'
      });
      setAnimeList(announcements);
    } catch (error) {
      console.error('Ошибка загрузки анонсов:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page announcements-page">
      <div className="page-header">
        <h1>Анонсы новых аниме</h1>
        <p>Самые ожидаемые новинки и анонсированные релизы</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length > 0 ? (
        <AnimeSection
          title="Ожидаемые релизы"
          animeList={animeList}
          showViewAll={false}
        />
      ) : (
        <div className="no-results">
          <p>На данный момент нет анонсированных аниме</p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;