// src/components/TitlePage/TitleInfo.jsx
import React from 'react';

const TitleInfo = ({ title, isRandomPage = false }) => {
  const {
    name,
    russian,
    image,
    description,
    year,
    kind,
    episodes,
    status,
    rating,
    genres = [],
    studios = []
  } = title;

  const displayName = russian || name;
  
  // Исправляем обработку URL изображений с удалением лишних пробелов
  let displayImage = 'https://via.placeholder.com/300x400?text=No+Image';
  
  if (image) {
    if (image.preview) {
      displayImage = image.preview.trim();
    } 
    else if (image.original && !image.original.startsWith('http')) {
      displayImage = `https://shikimori.one${image.original.trim()}`;
    } 
    else if (image.original) {
      displayImage = image.original.trim();
    }
  }

  // Функция для форматирования чисел с пробелами
  const formatNumber = (num) => {
    if (!num || num === '?' || num === '0') return 'Неизвестно';
    const number = parseInt(num);
    if (isNaN(number)) return 'Неизвестно';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Функция для перевода статуса на русский
  const getRussianStatus = (status) => {
    if (!status) return 'Неизвестно';
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'released':
      case 'completed':
        return 'Вышло';
      case 'ongoing':
        return 'Онгоинг';
      case 'announced':
        return 'Анонсировано';
      case 'delayed':
        return 'Отложено';
      default:
        return 'Неизвестно';
    }
  };

  // Функция для перевода типа на русский
  const getRussianKind = (kind) => {
    if (!kind) return 'Неизвестно';
    const kindLower = kind.toLowerCase();
    switch (kindLower) {
      case 'tv':
        return 'Сериал';
      case 'movie':
        return 'Фильм';
      case 'ova':
        return 'OVA';
      case 'ona':
        return 'ONA';
      case 'special':
        return 'Спешл';
      default:
        return 'Неизвестно';
    }
  };

  // Функция для получения русского названия жанра
  const getRussianGenre = (genre) => {
    if (!genre) return 'Неизвестный жанр';
    
    // Если есть русское название, используем его
    if (genre.russian) return genre.russian;
    
    // Если есть поле name, используем его
    if (genre.name) return genre.name;
    
    // Если это строка, возвращаем ее
    if (typeof genre === 'string') return genre;
    
    // Если это объект с полем genre, пробуем его
    if (genre.genre && genre.genre.russian) return genre.genre.russian;
    
    return 'Неизвестный жанр';
  };

  // Форматируем год
  const getFormattedYear = (year) => {
    if (!year || year === '?' || year === '0') return 'Неизвестно';
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return 'Неизвестно';
    return `${yearNum} г.`;
  };

  if (isRandomPage) {
    // Вертикальное отображение для страницы Рандом
    return (
      <div className="random-title-info">
        <div className="random-poster-container">
          <img
            src={displayImage}
            alt={`Постер ${displayName}`}
            className="random-poster"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=Image+Failed';
            }}
          />
        </div>
        
        <div className="random-details">
          <h1 className="random-title">{displayName}</h1>
          <p className="random-original-name">Оригинальное название: {name}</p>
          
          <div className="random-meta">
            <div className="meta-item">
              <span className="meta-label">Год:</span>
              <span className="meta-value">{getFormattedYear(year)}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Тип:</span>
              <span className="meta-value">{getRussianKind(kind)}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Статус:</span>
              <span className="meta-value">{getRussianStatus(status)}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Эпизоды:</span>
              <span className="meta-value">{formatNumber(episodes)}</span>
            </div>
            
            {rating && (
              <div className="meta-item">
                <span className="meta-label">Рейтинг:</span>
                <span className="meta-value rating-value">
                  <span className="star-icon">★</span>
                  {parseFloat(rating) > 0 ? parseFloat(rating).toFixed(1) : 'Нет рейтинга'}
                </span>
              </div>
            )}
          </div>
          
          {genres && genres.length > 0 && (
            <div className="random-genres">
              <span className="meta-label">Жанры:</span>
              <div className="genres-list">
                {genres.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {getRussianGenre(genre)}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {studios && studios.length > 0 && (
            <div className="random-studios">
              <span className="meta-label">Студии:</span>
              <div className="studios-list">
                {studios.map((studio, index) => (
                  <span key={index} className="studio-tag">
                    {studio.name || studio}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="random-description">
            <h3>Описание</h3>
            <p>{description || 'Описание отсутствует.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Оригинальное горизонтальное отображение для остальных страниц
  return (
    <div className="title-info">
      <div className="title-header">
        <img
          src={displayImage}
          alt={`Постер ${displayName}`}
          className="title-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x400?text=Image+Failed';
          }}
        />
        <div className="title-details">
          <h1 className="title-name">{displayName}</h1>
          <p className="title-original-name">Оригинальное название: {name}</p>
          <div className="title-meta">
            <span className="meta-item">Год: {getFormattedYear(year)}</span>
            <span className="meta-item">Тип: {getRussianKind(kind)}</span>
            <span className="meta-item">Статус: {getRussianStatus(status)}</span>
            <span className="meta-item">Эпизодов: {formatNumber(episodes)}</span>
            {rating && <span className="meta-item">Рейтинг: {rating}</span>}
          </div>
          <div className="title-genres">
            Жанры: {genres?.map(g => getRussianGenre(g)).join(', ') || 'Не указаны'}
          </div>
          <div className="title-studios">
            Студии: {studios?.map(s => s.name || s).join(', ') || 'Не указаны'}
          </div>
        </div>
      </div>

      <div className="title-description">
        <h3>Описание</h3>
        <p>{description || 'Описание отсутствует.'}</p>
      </div>
    </div>
  );
};

export default TitleInfo;