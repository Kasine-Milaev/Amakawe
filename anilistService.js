// src/services/anilistService.js
const ANILIST_API_URL = 'https://graphql.anilist.co';

export const getAnilistSchedule = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 50) {
        media(type: ANIME, status: RELEASING) {
          id
          title {
            romaji
            english
            native
          }
          episodes
          nextAiringEpisode {
            airingAt
            episode
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anilist API error: ${response.status}`);
    }

    const data = await response.json();
    const media = data.data.Page.media;
    
    // Форматируем данные под наш формат
    return media
      .filter(item => item.nextAiringEpisode)
      .map(item => ({
        id: item.id,
        name: item.title.romaji,
        russian: item.title.native,
        image: {
          original: item.coverImage.large
        },
        next_episode: item.nextAiringEpisode.episode,
        next_episode_at: new Date(item.nextAiringEpisode.airingAt * 1000).toISOString()
      }));
  } catch (error) {
    console.error('Ошибка при получении расписания Anilist:', error);
    return [];
  }
};