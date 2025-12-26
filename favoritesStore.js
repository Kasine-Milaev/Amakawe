// src/services/favoritesStore.js
const STORAGE_KEY = 'amakawe_favorites';

// Структура данных для хранения
const defaultData = {
  // Избранные персонажи
  favoriteCharacters: [1, 2, 3], // ID персонажей из Shikimori
  
  // Списки аниме
  animeLists: {
    planned: [1, 2], // ID аниме для "Буду смотреть"
    watching: [3],   // ID аниме для "Смотрю" с прогрессом
    dropped: [4]     // ID аниме для "Забросил"
  },
  
  // Прогресс просмотра
  watchingProgress: {
    3: { episode: 12, progress: 60 } // animeId: { episode, progress }
  },
  
  // Персонажи в "Мои вайфу"
  myWaifus: [
    { id: 1, name: 'Лелуш ви Бриттания', anime: 'Code Geass' },
    { id: 2, name: 'Эрен Йегер', anime: 'Attack on Titan' },
    { id: 3, name: 'Спайк Шпигель', anime: 'Cowboy Bebop' }
  ]
};

const getData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultData;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Методы для персонажей
export const getFavoriteCharacters = () => {
  const data = getData();
  return data.favoriteCharacters;
};

export const addFavoriteCharacter = (characterId) => {
  const data = getData();
  if (!data.favoriteCharacters.includes(characterId)) {
    data.favoriteCharacters.push(characterId);
    saveData(data);
  }
};

export const removeFavoriteCharacter = (characterId) => {
  const data = getData();
  data.favoriteCharacters = data.favoriteCharacters.filter(id => id !== characterId);
  saveData(data);
};

// Методы для списков аниме
export const getAnimeList = (listName) => {
  const data = getData();
  return data.animeLists[listName] || [];
};

export const addAnimeToList = (listName, animeId) => {
  const data = getData();
  if (!data.animeLists[listName].includes(animeId)) {
    data.animeLists[listName].push(animeId);
    saveData(data);
  }
};

export const removeAnimeFromList = (listName, animeId) => {
  const data = getData();
  data.animeLists[listName] = data.animeLists[listName].filter(id => id !== animeId);
  saveData(data);
};

export const moveAnimeToList = (fromList, toList, animeId) => {
  const data = getData();
  data.animeLists[fromList] = data.animeLists[fromList].filter(id => id !== animeId);
  if (!data.animeLists[toList].includes(animeId)) {
    data.animeLists[toList].push(animeId);
  }
  saveData(data);
};

// Методы для прогресса просмотра
export const getWatchingProgress = (animeId) => {
  const data = getData();
  return data.watchingProgress[animeId] || null;
};

export const setWatchingProgress = (animeId, episode, progress) => {
  const data = getData();
  data.watchingProgress[animeId] = { episode, progress };
  saveData(data);
};

// Методы для "Мои вайфу"
export const getMyWaifus = () => {
  const data = getData();
  return data.myWaifus || [];
};

export const addWaifu = (character) => {
  const data = getData();
  if (!data.myWaifus.some(w => w.id === character.id)) {
    data.myWaifus.push(character);
    saveData(data);
  }
};

export const removeWaifu = (characterId) => {
  const data = getData();
  data.myWaifus = data.myWaifus.filter(w => w.id !== characterId);
  saveData(data);
};

// Получение статистики
export const getStats = () => {
  const data = getData();
  return {
    planned: data.animeLists.planned.length,
    watching: data.animeLists.watching.length,
    dropped: data.animeLists.dropped.length,
    waifus: data.myWaifus.length
  };
};