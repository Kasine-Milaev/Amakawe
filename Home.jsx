// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import Search from '../components/Search';
import GenreCarousel from '../components/GenreCarousel';
import AnimeSection from '../components/AnimeSection';
import BrowseAll from './BrowseAll';
import { searchAnime, getPopularAnime, getNewAnime, getAnimeByGenre } from '../services/animeService';
import CalendarSection from '../components/Calendar/CalendarSection';

const Home = ({ isSearchVisible, toggleSearch }) => {
  const navigate = useNavigate(); // Инициализируем навигацию
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [popularGenres, setPopularGenres] = useState([]);
  const [newAnime, setNewAnime] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [viewAllFilter, setViewAllFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (searchQuery || viewAllFilter) return;
      
      try {
        setPopularGenres([
          { name: 'Сейнен', color: '#ff4d4d', slug: 'senen' },
          { name: 'Сёдзё', color: '#ff66b3', slug: 'shoujo' },
          { name: 'Комедия', color: '#ffcc00', slug: 'comedy' },
          { name: 'Романтика', color: '#ff99cc', slug: 'romance' },
          { name: 'Школа', color: '#ffcc66', slug: 'school' },
          { name: 'Безумие', color: '#cc0066', slug: 'dementia' },
          { name: 'Боевые искусства', color: '#0099cc', slug: 'martial-arts' },
          { name: 'Вампиры', color: '#330033', slug: 'vampire' },
        ]);
        
        // Загружаем данные с обработкой ошибок
        try {
          const newAnimeData = await getNewAnime();
          setNewAnime(newAnimeData);
        } catch (e) {
          console.error('Ошибка загрузки новых аниме:', e);
          setNewAnime([]);
        }
        
        try {
          const tvSeriesData = await getAnimeByGenre('tv');
          setTvSeries(tvSeriesData);
        } catch (e) {
          console.error('Ошибка загрузки TV-сериалов:', e);
          // Добавляем заглушку для отображения секции даже при ошибке
          setTvSeries([
            {
              id: 0,
              name: "Загрузка...",
              description: "Данные о TV-сериалах загружаются",
              image: { original: "https://via.placeholder.com/200x300?text=Loading..." }
            }
          ]);
        }
        
        try {
          const moviesData = await getAnimeByGenre('movie');
          setMovies(moviesData);
        } catch (e) {
          console.error('Ошибка загрузки фильмов:', e);
          // Добавляем заглушку для отображения секции даже при ошибке
          setMovies([
            {
              id: 0,
              name: "Загрузка...",
              description: "Данные о фильмах загружаются",
              image: { original: "https://via.placeholder.com/200x300?text=Loading..." }
            }
          ]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, viewAllFilter]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchAnime(query);
        setSearchResults(results);
        setViewAllFilter(null);
      } catch (error) {
        console.error('Ошибка при поиске:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleViewAllClick = (filterType, filterValue) => {
    setViewAllFilter({ type: filterType, value: filterValue });
    setSearchQuery('');
    setSearchResults(null);
  };

  // Обработчик клика по жанру
  const handleGenreClick = (genreSlug) => {
    navigate(`/genre/${genreSlug}`);
  };

  if (viewAllFilter) {
    return <BrowseAll filterType={viewAllFilter.type} filterValue={viewAllFilter.value} />;
  }

  return (
    <div className="page-home">
      {isSearchVisible && (
        <Search 
          onSearch={handleSearch} 
          searchInputRef={searchInputRef} 
          onClose={() => {
            toggleSearch();
            setSearchQuery('');
            setSearchResults(null);
          }}
        />
      )}
      
      {searchQuery && searchResults !== null ? (
        <AnimeSection 
          title={`Результаты поиска по запросу "${searchQuery}"`} 
          animeList={searchResults} 
        />
      ) : (
        <>
          {popularGenres.length > 0 && (
            <GenreCarousel 
              genres={popularGenres} 
              onGenreClick={handleGenreClick} // Передаем обработчик
            />
          )}
          
          <CalendarSection />
          
          {newAnime.length > 0 && (
            <AnimeSection
              title="Последние обновления и новые аниме"
              animeList={newAnime}
              showViewAll={true}
              onViewAllClick={() => handleViewAllClick('new', '')}
            />
          )}
          
          {tvSeries.length > 0 && (
            <AnimeSection
              title="Аниме сериалы"
              animeList={tvSeries}
              showViewAll={true}
              onViewAllClick={() => handleViewAllClick('kind', 'tv')}
            />
          )}
          
          {movies.length > 0 && (
            <AnimeSection
              title="Полнометражные фильмы"
              animeList={movies}
              showViewAll={true}
              onViewAllClick={() => handleViewAllClick('kind', 'movie')}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;