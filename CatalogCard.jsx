// src/components/Catalog/CatalogCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Маппинг названий жанров на slug
const genreNameToSlug = {
  // Русские названия
  'Сёнен': 'senen',
  'Сёдзё': 'shoujo',
  'Комедия': 'comedy',
  'Романтика': 'romance',
  'Школа': 'school',
  'Экшен': 'action',
  'Приключения': 'adventure',
  'Фэнтези': 'fantasy',
  'Фантастика': 'sci-fi',
  'Драма': 'drama',
  'Детектив': 'mystery',
  'Ужасы': 'horror',
  'Психологическое': 'psychological',
  'Спорт': 'sports',
  'Повседневность': 'slice-of-life',
  'Сверхъестественное': 'supernatural',
  'Меха': 'mecha',
  'Исторический': 'historical',
  'Музыка': 'music',
  
  // Английские названия
  'Shounen': 'senen',
  'Shoujo': 'shoujo',
  'Comedy': 'comedy',
  'Romance': 'romance',
  'School': 'school',
  'Action': 'action',
  'Adventure': 'adventure',
  'Fantasy': 'fantasy',
  'Sci-Fi': 'sci-fi',
  'Drama': 'drama',
  'Mystery': 'mystery',
  'Horror': 'horror',
  'Psychological': 'psychological',
  'Sports': 'sports',
  'Slice of Life': 'slice-of-life',
  'Supernatural': 'supernatural',
  'Mecha': 'mecha',
  'Historical': 'historical',
  'Music': 'music'
};

const CatalogCard = ({ title }) => {
  const navigate = useNavigate();
  const displayName = title.russian || title.name;
  const originalName = title.name;
  
  // Исправляем обработку URL изображений - убираем лишние пробелы
  let displayImage = 'https://via.placeholder.com/200x300?text=No+Image';
  
  if (title.image) {
    if (title.image.preview) {
      displayImage = title.image.preview.trim();
    } 
    else if (title.image.original && !title.image.original.startsWith('http')) {
      displayImage = `https://shikimori.one${title.image.original.trim()}`;
    } 
    else if (title.image.original) {
      displayImage = title.image.original.trim();
    }
  }

  // Определяем форматированный тип
  const getFormattedType = (kind) => {
    if (!kind) return 'Неизвестно';
    const kindLower = kind.toLowerCase();
    const types = {
      'tv': 'Сериал',
      'movie': 'Фильм',
      'ova': 'OVA',
      'ona': 'ONA',
      'special': 'Спешл'
    };
    return types[kindLower] || kind;
  };

  // Определяем возрастной рейтинг на основе рейтинга
  const getAgeRating = (rating) => {
    if (!rating) return 'PG-13';
    const numRating = parseFloat(rating);
    if (numRating >= 8.0) return 'PG-13';
    if (numRating >= 7.0) return '16+';
    return '18+';
  };

  // Получаем форматированный год
  const getFormattedYear = (year) => {
    if (!year || year === '????' || year === '0') return 'Неизвестно';
    const parsedYear = parseInt(year);
    if (isNaN(parsedYear)) return 'Неизвестно';
    return `${parsedYear} г.`;
  };

  // Форматируем статус для Shikimori
  const getFormattedStatus = (status) => {
    if (!status) return 'Неизвестно';
    const statusLower = status.toLowerCase();
    const statuses = {
      'released': 'Вышел',
      'ongoing': 'Онгоинг',
      'announced': 'Анонсирован',
      'completed': 'Вышел',
      'paused': 'Приостановлен'
    };
    return statuses[statusLower] || status;
  };

  // Функция для преобразования названия жанра в slug
  const getGenreSlug = (genreName) => {
    // Пробуем найти в маппинге
    if (genreNameToSlug[genreName]) {
      return genreNameToSlug[genreName];
    }
    
    // Если не нашли, пытаемся преобразовать название
    const slug = genreName
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]/g, '-') // Заменяем всё кроме букв и цифр на тире
      .replace(/-+/g, '-') // Убираем повторяющиеся тире
      .replace(/^-|-$/g, ''); // Убираем тире в начале и конце
    
    return slug;
  };

  // Обработчик клика по жанру
  const handleGenreClick = (genreName, e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал клик по карточке
    const slug = getGenreSlug(genreName);
    if (slug) {
      navigate(`/genre/${slug}`);
    }
  };

  return (
    <div className="catalog-card">
      <div className="catalog-card-image-container">
        <img
          src={displayImage}
          alt={`Постер ${displayName}`}
          className="catalog-card__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/200x300?text=Image+Failed';
          }}
        />
        {title.rating && parseFloat(title.rating) > 0 && (
          <div className="catalog-card-rating">
            <span className="star-icon">★</span>
            {parseFloat(title.rating).toFixed(1)}
          </div>
        )}
      </div>
      
      <h3 className="catalog-card__title">{displayName}</h3>
      {originalName && originalName !== displayName && (
        <p className="catalog-card__original-name">{originalName}</p>
      )}
      
      <div className="catalog-card-meta">
        <span className="catalog-card__year">{getFormattedYear(title.year)}</span>
        <span className="catalog-card__status">{getFormattedStatus(title.status)}</span>
        <span className="catalog-card__type">{getFormattedType(title.kind)}</span>
      </div>
      
      {/* Блок с жанрами */}
      {title.genres && title.genres.length > 0 && (
        <div className="catalog-card-genres">
          {title.genres.slice(0, 3).map((genre, index) => {
            const genreName = genre.russian || genre.name;
            return (
              <button
                key={index}
                className="genre-tag"
                onClick={(e) => handleGenreClick(genreName, e)}
                title={`Перейти к жанру: ${genreName}`}
              >
                {genreName}
              </button>
            );
          })}
          {title.genres.length > 3 && (
            <span className="more-genres">+{title.genres.length - 3}</span>
          )}
        </div>
      )}
      
      <p className="catalog-card__description">
        {title.description
          ? (title.description.length > 100
            ? `${title.description.substring(0, 100)}...`
            : title.description)
          : 'Описание отсутствует.'}
      </p>
    </div>
  );
};

export default CatalogCard;