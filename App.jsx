// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Random from './pages/Random';
import AnimeList from './pages/AnimeList';
import TitleDetailPage from './pages/TitleDetailPage';


function App() {
  return (
    <Router>
      <MainLayout>
        <Home />
        <Random />
        <AnimeList />
        <TitleDetailPage />
      </MainLayout>
    </Router>
  );
}

export default App;