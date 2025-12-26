// src/components/common/TopNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ toggleSearch, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGenresMenuOpen, setIsGenresMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  const genresMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (genresMenuRef.current && !genresMenuRef.current.contains(event.target)) {
        setIsGenresMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsProfileMenuOpen(false);
    setIsGenresMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsGenresMenuOpen(false);
  };

  const toggleGenresMenu = () => {
    setIsGenresMenuOpen(!isGenresMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const handleProfileItemClick = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const handleGenreItemClick = (path) => {
    navigate(path);
    setIsGenresMenuOpen(false);
  };

  return (
    <div className={`top-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo" onClick={() => handleNavClick('/')}>
        <span>Amakawe</span>
      </div>

      <nav className="navbar-menu">
        <span 
          className="navbar-item" 
          onClick={() => handleNavClick('/anime')}
        >
          Аниме
        </span>
        <span 
          className="navbar-item" 
          onClick={() => handleNavClick('/collections')}
        >
          Коллекции
        </span>
        <span 
          className="navbar-item" 
          onClick={() => handleNavClick('/random')}
        >
          Рандом
        </span>
        <div className="genres-menu-container" ref={genresMenuRef}>
          <span 
            className="navbar-item genres-trigger"
            onClick={toggleGenresMenu}
          >
            ⋮
          </span>
          
          {isGenresMenuOpen && (
            <div className="genres-dropdown-menu">
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/genres')}
              >
                <span className="genre-icon">🎭</span>
                <span>Жанры</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/announcements')}
              >
                <span className="genre-icon">📢</span>
                <span>Анонсы</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/series')}
              >
                <span className="genre-icon">📺</span>
                <span>Сериалы</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/movies')}
              >
                <span className="genre-icon">🎬</span>
                <span>Фильмы</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/ova')}
              >
                <span className="genre-icon">📼</span>
                <span>OVA</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/ona')}
              >
                <span className="genre-icon">🌐</span>
                <span>ONA</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleGenreItemClick('/specials')}
              >
                <span className="genre-icon">🌟</span>
                <span>Спешлы</span>
              </div>
            </div>
          )}
        </div>
      </nav>


      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <div className="profile-menu-container" ref={profileMenuRef}>
          <div className="profile-avatar" onClick={toggleProfileMenu}>
            <span>👤 Гость</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={`dropdown-arrow ${isProfileMenuOpen ? 'open' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {isProfileMenuOpen && (
            <div className="profile-dropdown-menu">
              <div 
                className="dropdown-item"
                onClick={() => handleProfileItemClick('/profile')}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Профиль</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleProfileItemClick('/favorites')}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Избранное</span>
              </div>
              
              <div 
                className="dropdown-item"
                onClick={() => handleProfileItemClick('/settings')}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Настройки</span>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-item logout">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Выйти</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;