// src/components/TitlePage/WatchButton.jsx
import React from 'react';

const WatchButton = ({ titleName }) => {
  // Простая логика поиска по названию на внешних сайтах
  const externalLinks = {
    crunchyroll: `https://www.crunchyroll.com/search?q=${encodeURIComponent(titleName)}`,
    anilibria: `https://anilibria.tv/search/?search=${encodeURIComponent(titleName)}`,
    shikimori: `https://shikimori.one/animes?search=${encodeURIComponent(titleName)}`,
  };

  return (
    <div className="watch-buttons">
      <h3>Где еще смотреть?</h3>
      <div className="watch-button-group">
        <a href={externalLinks.crunchyroll} target="_blank" rel="noopener noreferrer" className="button-incan watch-btn">
          Crunchyroll
        </a>
        <a href={externalLinks.anilibria} target="_blank" rel="noopener noreferrer" className="button-incan watch-btn">
          Anilibria
        </a>
        <a href={externalLinks.shikimori} target="_blank" rel="noopener noreferrer" className="button-incan watch-btn">
          Shikimori
        </a>
      </div>
    </div>
  );
};

export default WatchButton;