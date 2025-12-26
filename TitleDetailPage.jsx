// src/pages/TitleDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeById } from '../services/animeService';
import WatchButton from '../components/TitlePage/WatchButton';

const TitleDetailPage = ({ isSearchVisible, toggleSearch }) => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnimeById(id);
        setAnime(data);
      } catch (err) {
        setError('Не удалось загрузить информацию об аниме');
        console.error('Ошибка при загрузке деталей аниме:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="title-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка информации...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="title-detail-page">
        <div className="error-container">
          <p>{error || 'Аниме не найдено'}</p>
          <button onClick={handleBack} className="button-incan">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  // Исправляем обработку URL изображений
  const getPosterUrl = () => {
    if (!anime.image) return 'https://via.placeholder.com/300x400?text=No+Image';
    
    // Сначала пробуем preview
    if (anime.image.preview) {
      return anime.image.preview.trim();
    }
    
    // Затем original
    if (anime.image.original) {
      let url = anime.image.original.trim();
      // Если URL относительный, делаем его абсолютным
      if (!url.startsWith('http')) {
        url = `https://shikimori.one${url}`;
      }
      return url;
    }
    
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  return (
    <div className="title-detail-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>{anime.russian || anime.name}</h1>
      </div>

      <div className="title-content">
        <div className="title-poster-section">
          <img
            src={getPosterUrl()}
            alt={`Постер ${anime.russian || anime.name}`}
            className="title-poster-large"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=Image+Failed';
            }}
          />
        </div>

        <div className="title-info-section">
          <div className="title-meta">
            <div className="meta-item">
              <span className="meta-label">Год:</span>
              <span className="meta-value">{anime.year || 'Неизвестно'} г.</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Тип:</span>
              <span className="meta-value">{getRussianKind(anime.kind)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Статус:</span>
              <span className="meta-value">{getRussianStatus(anime.status)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Эпизоды:</span>
              <span className="meta-value">{anime.episodes || 'Неизвестно'}</span>
            </div>
            {anime.rating && (
              <div className="meta-item">
                <span className="meta-label">Рейтинг:</span>
                <span className="meta-value rating-value">
                  <span className="star-icon">★</span>
                  {parseFloat(anime.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="title-genres">
            <span className="meta-label">Жанры:</span>
            <div className="genres-list">
              {anime.genres?.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {getRussianGenre(genre)}
                </span>
              ))}
            </div>
          </div>

          {anime.studios && anime.studios.length > 0 && (
            <div className="title-studios">
              <span className="meta-label">Студии:</span>
              <div className="studios-list">
                {anime.studios.map((studio, index) => (
                  <span key={index} className="studio-tag">
                    {studio.name || studio}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="title-description">
            <h3>Описание</h3>
            <p>{anime.description || 'Описание отсутствует.'}</p>
          </div>
        </div>
      </div>

      <div className="player-section">
        <h2>Смотреть онлайн</h2>
        <KodikPlayer anime={anime} />
        <WatchButton titleName={anime.russian || anime.name} />
      </div>
    </div>
  );
};

// Вспомогательные функции
const getRussianKind = (kind) => {
  if (!kind) return 'Неизвестно';
  const kindLower = kind.toLowerCase();
  switch (kindLower) {
    case 'tv': return 'Сериал';
    case 'movie': return 'Фильм';
    case 'ova': return 'OVA';
    case 'ona': return 'ONA';
    case 'special': return 'Спешл';
    default: return 'Неизвестно';
  }
};

const getRussianStatus = (status) => {
  if (!status) return 'Неизвестно';
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'released': 
    case 'completed': return 'Вышел';
    case 'ongoing': return 'Онгоинг';
    case 'announced': return 'Анонсирован';
    case 'paused': return 'Приостановлен';
    default: return 'Неизвестно';
  }
};

const getRussianGenre = (genre) => {
  if (!genre) return 'Неизвестный жанр';
  if (genre.russian) return genre.russian;
  if (genre.name) return genre.name;
  if (typeof genre === 'string') return genre;
  return 'Неизвестный жанр';
};

// Функция для транслитерации названия
const transliterate = (text) => {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.toLowerCase()
    .replace(/[ъь]+/g, '')
    .replace(/й/g, 'y')
    .replace(/([^а-я\s])/g, '')
    .split('')
    .map(char => ru[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Компонент для видеоплеера Kodik (рабочая версия)
const KodikPlayer = ({ anime }) => {
  const [playerUrl, setPlayerUrl] = useState('');
  const [loadingPlayer, setLoadingPlayer] = useState(true);
  const [playerError, setPlayerError] = useState(null);
  const [quality, setQuality] = useState('720p');

  useEffect(() => {
    try {
      // Формируем заголовок для транслитерации
      const titleForTranslit = anime.russian || anime.name || 'anime';
      const translitTitle = transliterate(titleForTranslit);
      
      // Формируем URL как на Onichan.ru
      const baseUrl = `https://kodik.cc/serial/${anime.id}/${translitTitle}/${quality}`;
      
      setPlayerUrl(baseUrl);
      setLoadingPlayer(false);
    } catch (error) {
      setPlayerError('Ошибка при формировании URL плеера');
      setLoadingPlayer(false);
      console.error('Ошибка при формировании URL:', error);
    }
  }, [anime, quality]);

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
  };

  if (loadingPlayer) {
    return (
      <div className="player-container">
        <div className="player-loading">
          <div className="spinner"></div>
          <p>Подготовка видеоплеера...</p>
        </div>
      </div>
    );
  }

  if (playerError) {
    return (
      <div className="player-container">
        <div className="player-error">
          <p>{playerError}</p>
          <button onClick={() => window.location.reload()} className="button-incan">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-wrapper">
      <div className="quality-selector">
        <button 
          className={`quality-btn ${quality === '480p' ? 'active' : ''}`}
          onClick={() => handleQualityChange('480p')}
        >
          480p
        </button>
        <button 
          className={`quality-btn ${quality === '720p' ? 'active' : ''}`}
          onClick={() => handleQualityChange('720p')}
        >
          720p
        </button>
        <button 
          className={`quality-btn ${quality === '1080p' ? 'active' : ''}`}
          onClick={() => handleQualityChange('1080p')}
        >
          1080p
        </button>
      </div>
      
      <div className="player-container">
        <iframe
          src={playerUrl}
          frameBorder="0"
          allowFullScreen
          className="kodik-player"
          title={`Смотреть ${anime.russian || anime.name}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        />
      </div>
      
      <div className="player-info">
        <p>Если плеер не загружается, попробуйте обновить страницу или выбрать другое качество.</p>
      </div>
    </div>
  );
};

export default TitleDetailPage;