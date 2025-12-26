// src/components/AnimeSection.jsx
import React from 'react';
import CatalogCard from './Catalog/CatalogCard';

const AnimeSection = ({ title, animeList, showViewAll = false, onViewAllClick }) => {
  return (
    <section className="anime-section">
      <div className="section-header">
        <h2>{title}</h2>
        {showViewAll && onViewAllClick && (
          <button
            type="button"
            onClick={onViewAllClick}
            className="view-all-link"
          >
            Смотреть все
          </button>
        )}
      </div>
      <div className="catalog-grid">
        {animeList.slice(0, 10).map((anime) => (
          <CatalogCard key={anime.id} title={anime} />
        ))}
      </div>
    </section>
  );
};

export default AnimeSection;