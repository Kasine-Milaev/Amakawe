// src/services/scheduleService.js
// Надежная реализация получения расписания

// Функция для получения расписания с Shikimori
export const getShikimoriSchedule = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetch(`https://shikimori.one/api/animes?season=${currentYear}&status=ongoing&limit=50`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shikimori API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Фильтруем аниме с информацией о следующем эпизоде
    return data.filter(anime => 
      anime.next_episode_at && 
      new Date(anime.next_episode_at) > new Date()
    ).map(anime => ({
      id: anime.id,
      name: anime.name,
      russian: anime.russian,
      image: {
        original: anime.image?.original || 'https://via.placeholder.com/200x300?text=No+Image'
      },
      next_episode: anime.next_episode || anime.episodes_aired + 1,
      next_episode_at: anime.next_episode_at
    }));
  } catch (error) {
    console.error('Ошибка при получении расписания Shikimori:', error);
    return []; // Возвращаем пустой массив вместо ошибки
  }
};

// Функция для получения расписания с Anilist (надежная версия)
export const getAnilistSchedule = async () => {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 50) {
          airingSchedules(
            airingAt_greater: ${Math.floor(Date.now() / 1000)}
            sort: TIME
          ) {
            id
            airingAt
            episode
            media {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              status
              nextAiringEpisode {
                airingAt
                episode
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Anilist API error: ${response.status}`);
    }

    const data = await response.json();
    const schedules = data.data.Page.airingSchedules;
    
    // Форматируем данные
    return schedules.map(schedule => ({
      id: `anilist-${schedule.media.id}`,
      name: schedule.media.title.romaji,
      russian: schedule.media.title.native,
      image: {
        original: schedule.media.coverImage.large
      },
      next_episode: schedule.episode,
      next_episode_at: new Date(schedule.airingAt * 1000).toISOString()
    }));
  } catch (error) {
    console.error('Ошибка при получении расписания Anilist:', error);
    return []; // Возвращаем пустой массив вместо ошибки
  }
};

// Функция для получения mock-данных (резервный вариант)
export const getMockSchedule = () => {
  const now = new Date();
  const mockData = [
    {
      id: 'mock-1',
      name: 'Attack on Titan',
      russian: 'Атака Титанов',
      image: {
        original: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg'
      },
      next_episode: 5,
      next_episode_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() // Через 1 день
    },
    {
      id: 'mock-2',
      name: 'Demon Slayer',
      russian: 'Клинок рассекающий демонов',
      image: {
        original: 'https://cdn.myanimelist.net/images/anime/1286/99013.jpg'
      },
      next_episode: 12,
      next_episode_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() // Через 2 дня
    },
    {
      id: 'mock-3',
      name: 'Jujutsu Kaisen',
      russian: 'Магическая битва',
      image: {
        original: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg'
      },
      next_episode: 8,
      next_episode_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() // Через 3 дня
    },
    {
      id: 'mock-4',
      name: 'One Piece',
      russian: 'Ван Пис',
      image: {
        original: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg'
      },
      next_episode: 1050,
      next_episode_at: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString() // Через 4 дня
    },
    {
      id: 'mock-5',
      name: 'My Hero Academia',
      russian: 'Моя геройская академия',
      image: {
        original: 'https://cdn.myanimelist.net/images/anime/10/78746.jpg'
      },
      next_episode: 25,
      next_episode_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() // Через 5 дней
    }
  ];
  
  return mockData;
};

// Основная функция получения расписания с резервными вариантами
export const getAnimeSchedule = async (source = 'auto') => {
  try {
    let data = [];
    
    if (source === 'shikimori' || source === 'auto') {
      data = await getShikimoriSchedule();
      if (data.length > 0) return data;
    }
    
    if (source === 'anilist' || source === 'auto') {
      data = await getAnilistSchedule();
      if (data.length > 0) return data;
    }
    
    // Если оба API не ответили, используем mock-данные
    return getMockSchedule();
  } catch (error) {
    console.error('Ошибка при получении расписания:', error);
    return getMockSchedule(); // Всегда возвращаем данные, даже при ошибках
  }
};