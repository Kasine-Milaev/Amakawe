// src/components/Catalog/index.jsx
import React, { useState, useEffect } from 'react';
import CatalogCard from './CatalogCard';
import { searchAnime, getPopularAnime } from '../../services/animeService';

const Catalog = ({ searchQuery, filters }) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Эффект для загрузки данных при изменении поиска или фильтров
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (searchQuery) {
          // Если есть поисковый запрос, ищем по нему
          data = await searchAnime(searchQuery, filters);
        } else {
          // Если нет поиска, получаем популярные
          data = await getPopularAnime();
        }

        // Применяем фильтры на клиенте (временно, до интеграции с API)
        // if (filters.type) {
        //   data = data.filter(item => item.kind === filters.type.toLowerCase());
        // }
        // if (filters.status) {
        //   data = data.filter(item => item.status === filters.status);
        // }
        // if (filters.year) {
        //   data = data.filter(item => item.year == filters.year);
        // }

        setTitles(data);
      } catch (error) {
        console.error('Ошибка при загрузке каталога:', error);
        setTitles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, filters]); // Запускаем при изменении поиска или фильтров

  if (loading) {
    return <div className="catalog-loading">Загрузка...</div>;
  }

  return (
    <section className="catalog-section">
      <h2>{searchQuery ? `Результаты поиска по "${searchQuery}"` : 'Популярное'}</h2>
      {titles.length === 0 ? (
        <p>Аниме не найдено.</p>
      ) : (
        <div className="catalog-grid">
          {titles.map((title) => (
            <CatalogCard key={title.id} title={title} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Catalog;