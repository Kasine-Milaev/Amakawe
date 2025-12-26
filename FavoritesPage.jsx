// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Здесь будет загрузка избранного
    setTimeout(() => {
      setFavorites([
        { id: 1, name: 'Attack on Titan', type: 'Сериал', year: 2013 },
        { id: 2, name: 'Your Name', type: 'Фильм', year: 2016 },
        { id: 3, name: 'Death Note', type: 'Сериал', year: 2006 }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка избранного...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>Избранное</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>У вас пока нет избранных аниме</p>
          <p>Добавляйте аниме в избранное, нажимая на сердечко ❤️</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(item => (
            <div key={item.id} className="favorite-card">
              <h3>{item.name}</h3>
              <p>Тип: {item.type}</p>
              <p>Год: {item.year}</p>
              <button className="button-incan">Удалить из избранного</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;