// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { themes, applyTheme, getCurrentTheme, initTheme } from '../utils/theme';

// Переводы
const translations = {
  ru: {
    settings: 'Настройки',
    notifications: 'Уведомления',
    receiveNotifications: 'Получать уведомления',
    playback: 'Воспроизведение',
    autoContinue: 'Автопродолжение',
    defaultQuality: 'Качество по умолчанию',
    appearance: 'Внешний вид',
    theme: 'Тема',
    language: 'Язык',
    interfaceLanguage: 'Язык интерфейса',
    clearData: 'Очистка данных',
    clearCache: 'Очистить кэш',
    resetSettings: 'Сбросить настройки',
    back: 'Назад',
    dark: themes.dark.name,
    light: themes.light.name,
    sakura: themes.sakura.name,
    tokyo_night: themes.tokyo_night.name,
    bamboo: themes.bamboo.name,
    geisha: themes.geisha.name,
    russian: 'Русский',
    english: 'English',
    themeDescription: 'Выберите тему оформления'
  },
  en: {
    settings: 'Settings',
    notifications: 'Notifications',
    receiveNotifications: 'Receive notifications',
    playback: 'Playback',
    autoContinue: 'Auto continue',
    defaultQuality: 'Default quality',
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    interfaceLanguage: 'Interface language',
    clearData: 'Clear data',
    clearCache: 'Clear cache',
    resetSettings: 'Reset settings',
    back: 'Back',
    dark: themes.dark.name,
    light: themes.light.name,
    sakura: 'Sakura',
    tokyo_night: 'Tokyo Night',
    bamboo: 'Bamboo',
    geisha: 'Geisha',
    russian: 'Russian',
    english: 'English',
    themeDescription: 'Choose a theme'
  }
};

// Загрузка настроек из localStorage
const loadSettings = () => {
  const saved = localStorage.getItem('amakawe_settings');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    notifications: true,
    autoPlay: false,
    quality: '720p',
    theme: getCurrentTheme(),
    language: 'ru'
  };
};

// Применение языка
const applyLanguage = (lang) => {
  document.documentElement.lang = lang;
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings();
    // Инициализируем тему
    applyTheme(saved.theme);
    applyLanguage(saved.language);
    return saved;
  });
  const navigate = useNavigate();

  // Применяем настройки при их изменении
  useEffect(() => {
    localStorage.setItem('amakawe_settings', JSON.stringify(settings));
    applyLanguage(settings.language);
  }, [settings]);

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Немедленно применяем тему
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleResetSettings = () => {
    const confirmText = settings.language === 'ru' 
      ? 'Вы уверены, что хотите сбросить все настройки?'
      : 'Are you sure you want to reset all settings?';
    
    if (window.confirm(confirmText)) {
      const defaultSettings = {
        notifications: true,
        autoPlay: false,
        quality: '720p',
        theme: 'dark',
        language: 'ru'
      };
      setSettings(defaultSettings);
      applyTheme('dark');
      applyLanguage('ru');
      localStorage.setItem('amakawe_settings', JSON.stringify(defaultSettings));
      
      const successText = settings.language === 'ru' 
        ? 'Настройки сброшены!'
        : 'Settings reset!';
      alert(successText);
    }
  };

  const handleClearCache = () => {
    const confirmText = settings.language === 'ru'
      ? 'Вы уверены, что хотите очистить кэш? (Удалятся временные данные)'
      : 'Are you sure you want to clear cache? (Temporary data will be deleted)';
    
    if (window.confirm(confirmText)) {
      // Очищаем все, кроме настроек и избранного
      const keysToKeep = ['amakawe_settings', 'amakawe_favorites', 'amakawe_theme'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      const successText = settings.language === 'ru'
        ? 'Кэш очищен!'
        : 'Cache cleared!';
      alert(successText);
    }
  };

  const t = translations[settings.language] || translations.ru;

  return (
    <div className="settings-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← {t.back}
        </button>
        <h1>{t.settings}</h1>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>{t.notifications}</h3>
          <div className="setting-item">
            <span>{t.receiveNotifications}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t.playback}</h3>
          <div className="setting-item">
            <span>{t.autoContinue}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <span>{t.defaultQuality}</span>
            <select
              value={settings.quality}
              onChange={(e) => handleChange('quality', e.target.value)}
              className="quality-select"
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t.appearance}</h3>
          <div className="setting-item">
            <span>{t.theme}</span>
            <p className="setting-description">{t.themeDescription}: {themes[settings.theme]?.name}</p>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="theme-select"
            >
              {Object.entries(themes).map(([key, theme]) => (
                <option key={key} value={key}>
                  {t[key] || theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t.language}</h3>
          <div className="setting-item">
            <span>{t.interfaceLanguage}</span>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="language-select"
            >
              <option value="ru">{t.russian}</option>
              <option value="en">{t.english}</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>{t.clearData}</h3>
          <button 
            onClick={handleClearCache} 
            className="button-incan danger"
          >
            {t.clearCache}
          </button>
          
          <button 
            onClick={handleResetSettings} 
            className="button-incan danger"
          >
            {t.resetSettings}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;