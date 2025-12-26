// src/components/common/SidebarMenu.jsx
import React, { useState } from 'react';

const SidebarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Меню по умолчанию открыто
  const [activeItem, setActiveItem] = useState('favorites');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    console.log('Выбран пункт:', item);
    // Здесь будет логика навигации
  };

  return (
    <div className={`sidebar-menu ${isMenuOpen ? 'open' : 'closed'}`}>
      {/* Кнопка для сворачивания/разворачивания меню */}
      <button className="sidebar-toggle-btn" onClick={toggleMenu}>
        {isMenuOpen ? '«' : '»'}
      </button>

      {isMenuOpen && (
        <>
          <div className="sidebar-menu-header">
            <h2>Amakawe</h2>
            <p>Ваш персональный каталог аниме и дорам</p>
          </div>
          <div className="sidebar-menu-items">
            <div
              className={`sidebar-menu-item ${activeItem === 'favorites' ? 'active' : ''}`}
              onClick={() => handleItemClick('favorites')}
            >
              Избранное
            </div>
            <div
              className={`sidebar-menu-item ${activeItem === 'profile' ? 'active' : ''}`}
              onClick={() => handleItemClick('profile')}
            >
              Профиль
            </div>
            <div
              className={`sidebar-menu-item ${activeItem === 'settings' ? 'active' : ''}`}
              onClick={() => handleItemClick('settings')}
            >
              Настройки
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarMenu;