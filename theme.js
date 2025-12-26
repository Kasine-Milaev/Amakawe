// src/utils/theme.js - добавляем CSS-классы для темы
export const themes = {
  // Классические
  dark: {
    name: 'Ночь',
    description: 'Темная классическая тема',
    colors: {
      'bg-primary': '#0f1117',
      'bg-secondary': '#1a1c23',
      'bg-card': '#16181d',
      'text-primary': '#ffffff',
      'text-secondary': '#a0a0a0',
      'border-color': '#2a2d35',
      'accent': '#3b82f6',
      'shadow-color': 'rgba(0, 0, 0, 0.3)'
    }
  },
  light: {
    name: 'День',
    description: 'Светлая классическая тема',
    colors: {
      'bg-primary': '#f8fafc',
      'bg-secondary': '#ffffff',
      'bg-card': '#ffffff',
      'text-primary': '#1e293b',
      'text-secondary': '#64748b',
      'border-color': '#e2e8f0',
      'accent': '#3b82f6',
      'shadow-color': 'rgba(0, 0, 0, 0.1)'
    }
  },
  
  // Аниме/японские темы
  sakura: {
    name: 'Сакура',
    description: 'Нежная розовая тема в стиле цветущей сакуры',
    colors: {
      'bg-primary': '#fff5f7',
      'bg-secondary': '#ffeef1',
      'bg-card': '#ffeef1',
      'text-primary': '#4a044e',
      'text-secondary': '#7c3aed',
      'border-color': '#fbcfe8',
      'accent': '#ec4899',
      'shadow-color': 'rgba(236, 72, 153, 0.2)'
    }
  },
  tokyo_night: {
    name: 'Ночь Токио',
    description: 'Неоновая тема в стиле ночного Токио',
    colors: {
      'bg-primary': '#0a0a1f',
      'bg-secondary': '#111127',
      'bg-card': '#16162d',
      'text-primary': '#e0e0ff',
      'text-secondary': '#a0a0ff',
      'border-color': '#333355',
      'accent': '#6366f1',
      'shadow-color': 'rgba(99, 102, 241, 0.3)'
    }
  },
  bamboo: {
    name: 'Бамбук',
    description: 'Зеленая тема в стиле японского бамбукового леса',
    colors: {
      'bg-primary': '#0a1f0a',
      'bg-secondary': '#152715',
      'bg-card': '#1a2f1a',
      'text-primary': '#d4f7d4',
      'text-secondary': '#9ae69a',
      'border-color': '#2a4a2a',
      'accent': '#10b981',
      'shadow-color': 'rgba(16, 185, 129, 0.3)'
    }
  },
  geisha: {
    name: 'Редфор',
    description: 'Элегантная красно-черная тема',
    colors: {
      'bg-primary': '#1a0a0a',
      'bg-secondary': '#2a1515',
      'bg-card': '#351a1a',
      'text-primary': '#ffd6d6',
      'text-secondary': '#ffa5a5',
      'border-color': '#5a2a2a',
      'accent': '#dc2626',
      'shadow-color': 'rgba(220, 38, 38, 0.3)'
    }
  }
};

// Применение темы с добавлением класса к body
export const applyTheme = (themeName) => {
  const root = document.documentElement;
  const body = document.body;
  const theme = themes[themeName] || themes.dark;
  
  // Удаляем все предыдущие классы тем
  body.classList.remove('theme-dark', 'theme-light', 'theme-sakura', 'theme-tokyo_night', 'theme-bamboo', 'theme-geisha');
  
  // Добавляем новый класс темы
  body.classList.add(`theme-${themeName}`);
  
  // Устанавливаем атрибут для CSS
  root.setAttribute('data-theme', themeName);
  
  // Устанавливаем CSS-переменные
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Сохраняем в localStorage
  localStorage.setItem('amakawe_theme', themeName);
};

// Инициализация темы при загрузке
export const initTheme = () => {
  const savedTheme = localStorage.getItem('amakawe_theme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  } else {
    // Проверяем системную тему
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  
  // Слушаем изменения системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('amakawe_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
};

// Получение текущей темы
export const getCurrentTheme = () => {
  return localStorage.getItem('amakawe_theme') || 'dark';
};

// Получение информации о текущей теме
export const getCurrentThemeInfo = () => {
  const themeName = getCurrentTheme();
  return {
    name: themeName,
    ...themes[themeName]
  };
};