// src/pages/MyListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeById } from '../services/animeService';
import { getAnimeList, removeAnimeFromList } from '../services/favoritesStore';

const MyListsPage = () => {
  const { tab = 'planned' } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'planned', name: 'Буду смотреть', icon: '📋' },
    { id: 'watching', name: 'Смотрю', icon: '👁️' },
    { id: 'dropped', name: 'Забросил', icon: '❌' }
  ];

  useEffect(() => {
    loadAnimeList();
  }, [tab]);

  const loadAnimeList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const animeIds = getAnimeList(tab);
      
      if (animeIds.length === 0) {
        setAnimeList([]);
        setLoading(false);
        return;
      }

      const animePromises = animeIds.map(id => getAnimeById(id));
      const results = await Promise.allSettled(animePromises);
      
      const successfulAnime = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);
      
      setAnimeList(successfulAnime);
      
    } catch (err) {
      console.error('Ошибка загрузки списка:', err);
      setError('Не удалось загрузить список аниме');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabClick = (tabId) => {
    navigate(`/my-lists/${tabId}`);
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  const handleRemoveFromList = (animeId, e) => {
    e.stopPropagation();
    removeAnimeFromList(tab, animeId);
    setAnimeList(prev => prev.filter(anime => anime.id !== animeId));
  };

  const getEmptyMessage = () => {
    switch (tab) {
      case 'planned':
        return 'Вы еще не добавили аниме в список "Буду смотреть"';
      case 'watching':
        return 'У вас нет аниме в списке "Смотрю"';
      case 'dropped':
        return 'Вы не забросили ни одного аниме';
      default:
        return 'Список пуст';
    }
  };

  return (
    <div className="my-lists-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>Мои списки</h1>
      </div>

      <div className="lists-tabs">
        {tabs.map(tabItem => (
          <button
            key={tabItem.id}
            className={`tab-button ${tab === tabItem.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tabItem.id)}
          >
            <span className="tab-icon">{tabItem.icon}</span>
            <span className="tab-name">{tabItem.name}</span>
            {tab === tabItem.id && (
              <span className="tab-count">({animeList.length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка списка...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadAnimeList} className="button-incan">
            Попробовать снова
          </button>
        </div>
      ) : animeList.length === 0 ? (
        <div className="empty-list-container">
          <div className="empty-list-icon">
            {tabs.find(t => t.id === tab)?.icon || '📋'}
          </div>
          <p className="empty-list-message">{getEmptyMessage()}</p>
          <button 
            onClick={() => navigate('/anime')}
            className="button-incan"
          >
            Найти аниме
          </button>
        </div>
      ) : (
        <div className="anime-list-container">
          <div className="list-header">
            <h2>{tabs.find(t => t.id === tab)?.name}</h2>
            <p className="list-count">Всего: {animeList.length} аниме</p>
          </div>
          
          <div className="anime-grid">
            {animeList.map(anime => (
              <div 
                key={anime.id} 
                className="anime-card"
                onClick={() => handleAnimeClick(anime.id)}
              >
                <div className="anime-card-image">
                  <img 
                    src={anime.image?.original || 'https://via.placeholder.com/200x300?text=No+Image'} 
                    alt={anime.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                    }}
                  />
                  {anime.rating && (
                    <div className="anime-card-rating">
                      ⭐ {anime.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                
                <div className="anime-card-content">
                  <h3 className="anime-card-title">{anime.russian || anime.name}</h3>
                  
                  <div className="anime-card-meta">
                    {anime.year && <span className="meta-year">{anime.year}</span>}
                    {anime.kind && <span className="meta-type">{anime.kind}</span>}
                    {anime.episodes && <span className="meta-episodes">{anime.episodes} эп.</span>}
                  </div>
                  
                  <div className="anime-card-actions">
                    <button 
                      className="button-incan small"
                      onClick={(e) => handleRemoveFromList(anime.id, e)}
                    >
                      Удалить из списка
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListsPage;