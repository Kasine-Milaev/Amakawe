// src/pages/GenresPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { genresData } from '../data/genres';

const GenresPage = () => {
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    navigate(`/genre/${genre.slug}`);
  };

  return (
    <div className="genres-page">
      <div className="page-header">
        <h1>Все жанры аниме</h1>
        <p className="page-subtitle">Выберите жанр, который вас интересует, чтобы увидеть соответствующие аниме</p>
      </div>

      <div className="genres-container">
        {genresData.map(genre => (
          <div 
            key={genre.id}
            className="genre-card"
            onMouseEnter={() => setHoveredGenre(genre.id)}
            onMouseLeave={() => setHoveredGenre(null)}
            onClick={() => handleGenreClick(genre)}
          >
            <div className="genre-card-image">
              <div 
                className="genre-image"
                style={{
                  backgroundImage: `url(${genre.image})`,
                  filter: hoveredGenre === genre.id ? 'brightness(1.1)' : 'brightness(0.8)'
                }}
              />
              <div className="genre-overlay">
                <h3 className="genre-title">{genre.name}</h3>
              </div>
            </div>
            
            <div className="genre-card-content">
              <div className="genre-header">
                <h3 className="genre-name">{genre.name}</h3>
                <span className="genre-badge">Жанр</span>
              </div>
              
              <div className="genre-description">
                <p>{genre.description}</p>
              </div>
              
              <div className="genre-footer">
                <button className="button-incan genre-explore-btn">
                  Исследовать жанр →
                </button>
              </div>
            </div>
            
            <div className="genre-hover-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;