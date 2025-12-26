// src/pages/Random.jsx
import React, { useState, useEffect } from 'react';
import { getRandomAnime } from '../services/animeService';
import TitleInfo from '../components/TitlePage/TitleInfo';
import WatchButton from '../components/TitlePage/WatchButton';

const Random = ({ isSearchVisible, toggleSearch }) => {
  const [randomAnime, setRandomAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        // Сначала получаем список популярных аниме
        const animeList = await getPopularAnime();
        
        if (animeList.length === 0) {
          throw new Error('Не удалось получить список аниме');
        }
        
        // Выбираем случайное аниме из списка
        const randomIndex = Math.floor(Math.random() * animeList.length);
        const selectedAnime = animeList[randomIndex];
        
        // Получаем детальную информацию об аниме
        const detailedAnime = await getAnimeDetails(selectedAnime.id);
        
        setRandomAnime(detailedAnime || selectedAnime);
      } catch (err) {
        setError('Не удалось загрузить случайное аниме. Попробуйте позже.');
        console.error('Ошибка при загрузке случайного аниме:', err);
        
        // В качестве резерва используем первый аниме из списка
        try {
          const animeList = await getPopularAnime();
          if (animeList.length > 0) {
            setRandomAnime(animeList[0]);
          }
        } catch (fallbackError) {
          console.error('Ошибка при загрузке резервного аниме:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAnime();
  }, []);

  const getAnimeDetails = async (animeId) => {
    try {
      const response = await fetch(`https://shikimori.one/api/animes/${animeId}`, {
        headers: {
          'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Форматируем данные для соответствия нашей структуре
        return {
          id: data.id,
          name: data.name,
          russian: data.russian,
          image: {
            original: data.image?.original,
            preview: data.image?.preview
          },
          description: data.description,
          year: data.year,
          kind: data.kind,
          episodes: data.episodes,
          status: data.status,
          rating: data.score,
          genres: data.genres || [],
          studios: data.studios || []
        };
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении деталей аниме:', error);
      return null;
    }
  };

  const getPopularAnime = async () => {
    try {
      const response = await fetch('https://shikimori.one/api/animes?limit=50&order=popularity', {
        headers: {
          'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Форматируем данные
        return data.map(anime => ({
          id: anime.id,
          name: anime.name,
          russian: anime.russian,
          image: {
            original: anime.image?.original,
            preview: anime.image?.preview
          },
          description: anime.description,
          year: anime.year,
          kind: anime.kind,
          episodes: anime.episodes,
          status: anime.status,
          rating: anime.score,
          genres: anime.genres || [],
          studios: anime.studios || []
        }));
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении популярного аниме:', error);
      return [];
    }
  };

  const handleNewRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const animeList = await getPopularAnime();
      
      if (animeList.length === 0) {
        throw new Error('Не удалось получить список аниме');
      }
      
      const randomIndex = Math.floor(Math.random() * animeList.length);
      const selectedAnime = animeList[randomIndex];
      
      const detailedAnime = await getAnimeDetails(selectedAnime.id);
      
      setRandomAnime(detailedAnime || selectedAnime);
    } catch (err) {
      setError('Не удалось загрузить новое случайное аниме. Попробуйте позже.');
      console.error('Ошибка при загрузке нового случайного аниме:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="random-page">
        <div className="random-loading">
          <div className="spinner"></div>
          <p>Выбираем случайное аниме...</p>
        </div>
      </div>
    );
  }

  if (error && !randomAnime) {
    return (
      <div className="random-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleNewRandom} className="button-incan">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!randomAnime) {
    return (
      <div className="random-page">
        <div className="no-anime">
          <p>Не удалось найти случайное аниме</p>
          <button onClick={handleNewRandom} className="button-incan">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="random-page">
      <div className="random-header">
        <h1>Случайное аниме</h1>
        <button onClick={handleNewRandom} className="button-incan new-random-btn">
          Другой случайный выбор
        </button>
      </div>
      
      <div className="random-content">
        <TitleInfo title={randomAnime} isRandomPage={true} />
        <WatchButton titleName={randomAnime.russian || randomAnime.name} />
      </div>
    </div>
  );
};

export default Random;