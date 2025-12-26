// src/services/animeService.js
const API_URL = 'https://shikimori.one/api/animes';

export const searchAnime = async (query, filters = {}) => {
  const params = new URLSearchParams();
  
  if (query) params.append('search', query);
  if (filters.kind) params.append('kind', filters.kind);
  if (filters.status) params.append('status', filters.status);
  if (filters.year) params.append('season', `${filters.year}`);
  if (filters.order) params.append('order', filters.order);
  if (filters.limit) params.append('limit', filters.limit.toString());
  else params.append('limit', '50');
  
if (filters.genre) {
    params.append('genre', filters.genre);
  }

  if (filters.genres) {
    if (Array.isArray(filters.genres)) {
      params.append('genres', filters.genres.join(','));
    } else {
      params.append('genres', filters.genres);
    }
  }
  
  // Добавляем параметр page для пагинации
  if (filters.page) params.append('page', filters.page.toString());
  
  try {
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(anime => ({
      id: anime.id,
      name: anime.name,
      russian: anime.russian,
      image: {
        original: anime.image?.original || 'https://via.placeholder.com/200x300?text=No+Image'
      },
      description: anime.description || 'Описание отсутствует.',
      year: anime.year,
      kind: anime.kind,
      episodes: anime.episodes,
      status: anime.status,
      rating: anime.score,
      genres: anime.genres || [],
      studios: anime.studios || []
    }));
  } catch (error) {
    console.error('Ошибка при поиске аниме:', error);
    return [];
  }
};

export const getPopularAnime = async () => {
  return searchAnime('', {
    order: 'popularity',
    limit: 20
  });
};

export const getNewAnime = async () => {
  return searchAnime('', {
    order: 'aired_on',
    limit: 20,
    year: new Date().getFullYear()
  });
};

// Исправленный метод для получения аниме по типу
export const getAnimeByType = async (type, page = 1, limit = 50) => {
  return searchAnime('', { 
    kind: type, 
    limit, 
    page,
    order: type === 'movie' ? 'released_on' : 'popularity'
  });
};
export const getAnimeById = async (id) => {
  try {
    const response = await fetch(`https://shikimori.one/api/animes/${id}`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Форматируем данные для соответствия нашей структуре
    return {
      id: data.id,
      name: data.name,
      russian: data.russian,
      image: {
        original: data.image?.original,
        preview: data.image?.preview
      },
      description: data.description || 'Описание отсутствует.',
      year: data.year,
      kind: data.kind,
      episodes: data.episodes,
      status: data.status,
      rating: data.score,
      genres: data.genres || [],
      studios: data.studios || [],
      duration: data.duration,
      season: data.season,
      aired_on: data.aired_on,
      released_on: data.released_on
    };
  } catch (error) {
    console.error('Ошибка при получении деталей аниме:', error);
    throw error;
  }
};
export const getMovies = async () => {
  return searchAnime('', {
    kind: 'movie',
    order: 'popularity',
    limit: 20
  });
};
export const getRandomAnime = async () => {
  try {
    // Получаем популярные аниме
    const popularAnime = await getPopularAnime();
    
    if (popularAnime.length === 0) {
      // Если нет популярных, пробуем получить новые
      const newAnime = await getNewAnime();
      if (newAnime.length > 0) {
        const randomIndex = Math.floor(Math.random() * newAnime.length);
        return newAnime[randomIndex];
      }
      return null;
    }
    
    // Выбираем случайное аниме
    const randomIndex = Math.floor(Math.random() * popularAnime.length);
    const selectedAnime = popularAnime[randomIndex];
    
    // Получаем детальную информацию о выбранном аниме
    try {
      const response = await fetch(`https://shikimori.one/api/animes/${selectedAnime.id}`, {
        headers: {
          'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const detailedData = await response.json();
        
        // Форматируем данные для соответствия нашей структуре
        return {
          id: detailedData.id,
          name: detailedData.name,
          russian: detailedData.russian,
          image: {
            original: detailedData.image?.original || selectedAnime.image?.original,
            preview: detailedData.image?.preview || selectedAnime.image?.preview
          },
          description: detailedData.description || selectedAnime.description,
          year: detailedData.year || selectedAnime.year,
          kind: detailedData.kind || selectedAnime.kind,
          episodes: detailedData.episodes || selectedAnime.episodes,
          status: detailedData.status || selectedAnime.status,
          rating: detailedData.score || selectedAnime.rating,
          genres: detailedData.genres || selectedAnime.genres,
          studios: detailedData.studios || selectedAnime.studios
        };
      }
      
      // Если не удалось получить детали, возвращаем базовые данные
      return selectedAnime;
    } catch (detailError) {
      console.warn('Не удалось получить детали аниме, используем базовые данные:', detailError);
      return selectedAnime;
    }
  } catch (error) {
    console.error('Ошибка при получении случайного аниме:', error);
    return null;
  }
};

export const getAnimeByGenre = async (genreName, page = 1, limit = 50) => {
  // Для жанров используем общий поиск
  return searchAnime('', { 
    limit, 
    page,
    order: 'popularity'
  });
};


export const getAllGenres = async () => {
  return [
    'Сейнен', 'Сёдзё', 'Комедия', 'Романтика', 'Школа', 'Безумие',
    'Боевые искусства', 'Вампиры', 'Космос', 'Перевоплотился', 'Военное',
    'Магия', 'Психологическое', 'Гарем', 'Машины', 'Самураи', 'Демоны',
    'Меха', 'Сверхъестественное', 'Детектив', 'Музыка', 'Спорт', 'Драма',
    'Пародия', 'Драки', 'Новые игры', 'Повседневность', 'Ужасы'
  ];
}
export const getAnimeSchedule = async () => {
  try {
    // Получаем популярные аниме
    const popularAnime = await getPopularAnime();
    
    // Для каждого аниме получаем детальную информацию
    const detailedAnime = await Promise.all(
      popularAnime.slice(0, 30).map(async (anime) => {
        try {
          const response = await fetch(`https://shikimori.one/api/animes/${anime.id}`, {
            headers: {
              'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            return null;
          }
          
          const data = await response.json();
          
          // Проверяем, есть ли информация о следующем эпизоде
          if (data.next_episode_at) {
            return {
              id: data.id,
              name: data.name,
              russian: data.russian,
              image: data.image,
              next_episode: data.next_episode || (data.episodes_aired + 1),
              next_episode_at: data.next_episode_at
            };
          }
          return null;
        } catch (error) {
          console.error(`Ошибка при получении деталей для аниме ${anime.id}:`, error);
          return null;
        }
      })
    );
    
    // Фильтруем успешные результаты
    const validAnime = detailedAnime.filter(item => item && item.next_episode_at);
    
    // Группируем по датам
    const groupedByDate = {};
    validAnime.forEach(anime => {
      const date = new Date(anime.next_episode_at);
      const formattedDate = date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric'
      });
      
      if (!groupedByDate[formattedDate]) {
        groupedByDate[formattedDate] = [];
      }
      
      groupedByDate[formattedDate].push(anime);
    });
    
    // Преобразуем в массив для рендера
    return Object.entries(groupedByDate).map(([date, animeList]) => ({
      date,
      anime: animeList
    })).sort((a, b) => new Date(a.anime[0].next_episode_at) - new Date(b.anime[0].next_episode_at));
    
  } catch (error) {
    console.error('Ошибка при получении расписания:', error);
    return [];
  }
};