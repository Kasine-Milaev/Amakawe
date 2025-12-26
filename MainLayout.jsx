// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import TopNavbar from '../components/common/TopNavbar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Random from '../pages/Random';
import AnimeList from '../pages/AnimeList';
import TitleDetailPage from '../pages/TitleDetailPage';
import ProfilePage from '../pages/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage';
import SettingsPage from '../pages/SettingsPage';
import CharacterPage from '../pages/CharacterPage';
import MyListsPage from '../pages/MyListsPage';
import GenresPage from '../pages/GenresPage';
import GenrePage from '../pages/GenrePage';

const MainLayout = ({ children }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  
  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
  };

  const handleNavigation = (path) => {
    if (isSearchVisible) {
      setIsSearchVisible(false);
    }
    
    if (path === '/random') {
      navigate('/random');
    } else if (path === '/anime') {
      navigate('/anime');
    } else if (path === '/') {
      navigate('/');
    } else if (path === '/collections') {
      console.log('Переход к коллекциям');
    }
  };

  return (
    <div className="app-layout">
      <TopNavbar 
        toggleSearch={toggleSearch} 
        onNavigate={handleNavigation}
      />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/random" 
            element={
              <Random 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/anime" 
            element={
              <AnimeList 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/anime/:id" 
            element={
              <TitleDetailPage 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProfilePage 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <FavoritesPage 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <SettingsPage 
                isSearchVisible={isSearchVisible} 
                toggleSearch={toggleSearch} 
              />
            } 
          />
          <Route 
  path="/character/:id" 
  element={
    <CharacterPage 
      isSearchVisible={isSearchVisible} 
      toggleSearch={toggleSearch} 
    />
  } 
/>
<Route 
  path="/my-lists" 
  element={
    <MyListsPage 
      isSearchVisible={isSearchVisible} 
      toggleSearch={toggleSearch} 
    />
  } 
/>
<Route 
  path="/my-lists/:tab" 
  element={
    <MyListsPage 
      isSearchVisible={isSearchVisible} 
      toggleSearch={toggleSearch} 
    />
  } 
/>
<Route 
  path="/genres" 
  element={
    <GenresPage 
      isSearchVisible={isSearchVisible} 
      toggleSearch={toggleSearch} 
    />
  } 
/>
<Route 
  path="/genre/:slug" 
  element={
    <GenrePage 
      isSearchVisible={isSearchVisible} 
      toggleSearch={toggleSearch} 
    />
  } 
/>
<Route 
  path="/announcements" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>Анонсы</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
<Route 
  path="/series" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>Сериалы</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
<Route 
  path="/movies" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>Фильмы</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
<Route 
  path="/ova" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>OVA</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
<Route 
  path="/ona" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>ONA</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
<Route 
  path="/specials" 
  element={
    <div className="page-placeholder">
      <div className="page-header">
        <h1>Спешлы</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  } 
/>
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;