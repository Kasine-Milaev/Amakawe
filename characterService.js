// src/services/characterService.js
const API_BASE = 'https://shikimori.one/api';

export const getCharacterById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/characters/${id}`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      russian: data.russian,
      image: {
        original: data.image?.original,
        preview: data.image?.preview,
        x96: data.image?.x96,
        x48: data.image?.x48
      },
      url: data.url,
      altname: data.altname,
      japanese: data.japanese,
      description: data.description,
      animes: data.animes || [],
      mangas: data.mangas || [],
      seyu: data.seyu || []
    };
  } catch (error) {
    console.error('Ошибка при получении персонажа:', error);
    throw error;
  }
};

export const getCharactersByIds = async (ids) => {
  const promises = ids.map(id => getCharacterById(id));
  return Promise.all(promises);
};

export const searchCharacters = async (query, limit = 10) => {
  try {
    const params = new URLSearchParams({
      search: query,
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE}/characters?${params.toString()}`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(character => ({
      id: character.id,
      name: character.name,
      russian: character.russian,
      image: character.image,
      url: character.url
    }));
  } catch (error) {
    console.error('Ошибка при поиске персонажей:', error);
    return [];
  }
};

export const getPopularCharacters = async (limit = 10) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE}/characters?${params.toString()}`, {
      headers: {
        'User-Agent': 'Amakawe/1.0 (https://github.com/yourusername/amakawe)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(character => ({
      id: character.id,
      name: character.name,
      russian: character.russian,
      image: character.image,
      url: character.url
    }));
  } catch (error) {
    console.error('Ошибка при получении популярных персонажей:', error);
    return [];
  }
};