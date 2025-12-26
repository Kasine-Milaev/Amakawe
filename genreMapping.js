// src/data/genreMapping.js
export const genreIdMapping = {
  'senen': '27', // Сёнен
  'shoujo': '25', // Сёдзё
  'comedy': '4', // Комедия
  'romance': '22', // Романтика
  'school': '23', // Школа
  'action': '1', // Экшен
  'sports': '30', // Спорт
  'fantasy': '10', // Фэнтези
  'sci-fi': '24', // Фантастика
  'horror': '14', // Ужасы
  'drama': '8', // Драма
  'mystery': '7', // Детектив
  'psychological': '40', // Психологическое
  'supernatural': '37', // Сверхъестественное
  'mecha': '18', // Меха
  'historical': '13', // Исторический
  'music': '19', // Музыка
  'slice-of-life': '36', // Повседневность
  'dementia': '5', // Безумие
  'martial-arts': '17', // Боевые искусства
  'vampire': '32' // Вампиры
};

// Маппинг русских названий на слаги
export const russianToSlugMapping = {
  'Сейнен': 'senen',
  'Сёдзё': 'shoujo',
  'Комедия': 'comedy',
  'Романтика': 'romance',
  'Школа': 'school',
  'Безумие': 'dementia',
  'Боевые искусства': 'martial-arts',
  'Вампиры': 'vampire'
};

// Функция для получения слага по русскому названию
export const getGenreSlug = (russianName) => {
  return russianToSlugMapping[russianName] || 
         russianName.toLowerCase().replace(/\s+/g, '-');
};