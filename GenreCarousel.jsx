// src/components/GenreCarousel.jsx
import React from 'react';
import './GenreCarousel.css';

const GenreCarousel = ({ genres, onGenreClick }) => {
  // Цвета для жанров (можно расширить)
  const genreColors = {
    'Сейнен': { primary: '#ff4d4d', secondary: '#ff8585' },
    'Сёдзё': { primary: '#ff66b3', secondary: '#ff99cc' },
    'Комедия': { primary: '#ffcc00', secondary: '#ffdd66' },
    'Романтика': { primary: '#ff99cc', secondary: '#ffb3d9' },
    'Школа': { primary: '#ffcc66', secondary: '#ffe099' },
    'Безумие': { primary: '#cc0066', secondary: '#e60080' },
    'Боевые искусства': { primary: '#0099cc', secondary: '#33b3e6' },
    'Вампиры': { primary: '#330033', secondary: '#660066' },
    'Фэнтези': { primary: '#9966cc', secondary: '#b399cc' },
    'Драма': { primary: '#993300', secondary: '#cc4400' }
  };

  // Фоновые изображения для жанров
  const genreImages = {
    'Сейнен': 'https://avatars.mds.yandex.net/i?id=5cd91500532852a32fd6405116c5f19a_l-5247044-images-thumbs&n=13',
    'Сёдзё': 'https://i.pinimg.com/736x/15/0e/6f/150e6ffb702d95619b0eb883877a42b8.jpg',
    'Комедия': 'https://i.ytimg.com/vi/Hu-ZUr-juoA/maxresdefault.jpg',
    'Романтика': 'https://i.ytimg.com/vi/HZ_ShDllMZQ/maxresdefault.jpg',
    'Школа': 'https://avatars.mds.yandex.net/i?id=86246cf5069e16db93b502df305c4717f9874a97-4517378-images-thumbs&n=13',
    'Безумие': 'https://avatars.mds.yandex.net/i?id=ac9d6ba7ac026c7e39c31adcf0db0495d6d43363-5219071-images-thumbs&n=13',
    'Боевые искусства': 'https://avatars.mds.yandex.net/i?id=82758de2c550e517bbd50ce017a40ed552237de4-9099630-images-thumbs&n=13',
    'Вампиры': 'https://avatars.mds.yandex.net/i?id=4ee5f2eab78dcc21383bd6b63d30ccbd631baabc-9269077-images-thumbs&n=13'
  };

  return (
    <section className="genre-carousel-section">
      <div className="section-header">
        <h2>Популярные жанры</h2>
        <button className="view-all-link">
          Смотреть все →
        </button>
      </div>
      <div className="genre-carousel">
        {genres.map((genre, index) => {
          const colors = genreColors[genre.name] || { primary: '#64748b', secondary: '#94a3b8' };
          const backgroundImage = genreImages[genre.name] || 'https://via.placeholder.com/300x400/334155/94a3b8?text=Жанр';
          
          return (
            <div 
              key={index} 
              className="genre-card"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer'
              }}
              onClick={() => onGenreClick(genre.slug)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && onGenreClick) {
                  onGenreClick(genre.slug);
                }
              }}
            >
              <div 
                className="genre-card-overlay"
                style={{
                  background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, ${colors.primary} 100%)`
                }}
              />
              <div 
                className="genre-card-title"
                style={{
                  color: '#ffffff',
                  textShadow: `0 2px 4px ${colors.secondary}`
                }}
              >
                {genre.name}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GenreCarousel;