// src/pages/CharacterPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../services/characterService';
import { getAnimeById } from '../services/animeService';

const CharacterPage = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacter();
  }, [id]);

  const loadCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCharacterById(id);
      setCharacter(data);
    } catch (err) {
      console.error('Ошибка загрузки персонажа:', err);
      setError('Не удалось загрузить информацию о персонаже');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  if (loading) {
    return (
      <div className="character-page">
        <div className="page-header">
          <button onClick={handleBack} className="button-incan back-button">
            ← Назад
          </button>
          <h1>Загрузка...</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка информации о персонаже...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="character-page">
        <div className="page-header">
          <button onClick={handleBack} className="button-incan back-button">
            ← Назад
          </button>
          <h1>Ошибка</h1>
        </div>
        <div className="error-container">
          <p>{error || 'Персонаж не найден'}</p>
          <button onClick={handleBack} className="button-incan">
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="character-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>{character.russian || character.name}</h1>
      </div>

      <div className="character-content">
        <div className="character-info">
          <div className="character-poster">
            <img 
              src={character.image?.original || character.image?.preview || 'https://via.placeholder.com/300x450?text=No+Image'} 
              alt={character.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          </div>
          
          <div className="character-details">
            <h2>Информация о персонаже</h2>
            
            {character.altname && (
              <div className="detail-item">
                <span className="detail-label">Альтернативное имя:</span>
                <span className="detail-value">{character.altname}</span>
              </div>
            )}
            
            {character.japanese && (
              <div className="detail-item">
                <span className="detail-label">Японское имя:</span>
                <span className="detail-value">{character.japanese}</span>
              </div>
            )}
            
            <div className="detail-item">
              <span className="detail-label">ID в Shikimori:</span>
              <span className="detail-value">{character.id}</span>
            </div>
          </div>
        </div>

        {character.description && (
          <div className="character-description">
            <h3>Описание</h3>
            <p dangerouslySetInnerHTML={{ __html: character.description }} />
          </div>
        )}

        {character.animes && character.animes.length > 0 && (
          <div className="character-animes">
            <h3>Появления в аниме</h3>
            <div className="anime-grid">
              {character.animes.slice(0, 5).map(anime => (
                <div 
                  key={anime.id} 
                  className="anime-card-small"
                  onClick={() => handleAnimeClick(anime.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="anime-card-image">
                    <img 
                      src={anime.image?.preview || 'https://via.placeholder.com/100x150?text=No+Image'} 
                      alt={anime.name}
                    />
                  </div>
                  <div className="anime-card-info">
                    <p className="anime-card-title">{anime.russian || anime.name}</p>
                    <p className="anime-card-role">{anime.role || 'Персонаж'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {character.seyu && character.seyu.length > 0 && (
          <div className="character-seyu">
            <h3>Сэйю (озвучка)</h3>
            <div className="seyu-list">
              {character.seyu.slice(0, 3).map(seiyu => (
                <div key={seiyu.id} className="seyu-item">
                  <p className="seyu-name">{seiyu.russian || seiyu.name}</p>
                  <p className="seyu-language">{seiyu.language || 'Японский'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterPage;