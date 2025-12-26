// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharactersByIds } from '../services/characterService';
import { getAnimeById } from '../services/animeService';
import { 
  getMyWaifus, 
  getStats,
  getAnimeList,
  getWatchingProgress
} from '../services/favoritesStore';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Гость',
    avatar: '👤',
    email: '',
    stats: {
      watched: 0,
      planned: 0,
      dropped: 0,
      friends: 0,
      rating: 0
    },
    status: 'offline',
    bio: ''
  });
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watching, setWatching] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Проверяем, есть ли сохраненный пользователь в localStorage
      const savedUser = localStorage.getItem('animeUser');
      
      if (savedUser) {
        // Загружаем сохраненные данные пользователя
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        if (userData.email && userData.email.includes('@gmail.com')) {
          setIsGuest(false);
          setIsLoggedIn(true);
        }
      }

      // Загружаем "Мои вайфу" (персонажей)
      const waifus = getMyWaifus();
      if (waifus.length > 0) {
        const characterIds = waifus.map(w => w.id);
        const characters = await getCharactersByIds(characterIds);
        const waifusWithImages = characters.map(char => ({
          id: char.id,
          name: char.name,
          russian: char.russian || char.name,
          image: char.image,
          anime: waifus.find(w => w.id === char.id)?.anime || 'Неизвестно'
        }));
        setFavorites(waifusWithImages);
      }

      // Загружаем "Продолжить просмотр"
      const watchingIds = getAnimeList('watching');
      if (watchingIds.length > 0) {
        const watchingPromises = watchingIds.map(async (animeId) => {
          try {
            const anime = await getAnimeById(animeId);
            const progress = getWatchingProgress(animeId);
            return {
              id: anime.id,
              name: anime.russian || anime.name,
              episode: progress?.episode || 1,
              progress: progress?.progress || 0,
              image: anime.image
            };
          } catch (error) {
            console.error(`Ошибка загрузки аниме ${animeId}:`, error);
            return null;
          }
        });
        
        const watchingResults = await Promise.all(watchingPromises);
        setWatching(watchingResults.filter(item => item !== null));
      }

      // Обновляем статистику из хранилища
      const stats = getStats();
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          planned: stats.planned || 0,
          dropped: stats.dropped || 0,
          watched: stats.watched || 0
        }
      }));

      // Загружаем пример постов
      setPosts([
        { 
          id: 1, 
          text: 'Только что посмотрел новую серию Attack on Titan! Невероятно!', 
          time: '2 часа назад',
          likes: 5,
          comments: 2
        },
        { 
          id: 2, 
          text: 'Добавил 5 новых аниме в список "Буду смотреть"', 
          time: '1 день назад',
          likes: 3,
          comments: 1
        },
        { 
          id: 3, 
          text: 'Моя рекомендация на сегодня: "Vinland Saga" - обязательно к просмотру!', 
          time: '3 дня назад',
          likes: 8,
          comments: 4
        }
      ]);

    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для входа через Google (имитация)
  const handleGoogleLogin = () => {
    // В реальном приложении здесь будет вызов OAuth Google
    // Пока что имитируем успешный вход
    const googleUser = {
      name: 'Анимешник',
      email: 'animefan@gmail.com',
      avatar: '👨‍💻',
      stats: {
        watched: 42,
        planned: 12,
        dropped: 3,
        friends: 24,
        rating: 87
      },
      status: 'online',
      bio: 'Любитель аниме, коллекционер моментов из любимых сериалов. Специалист по вайфу.'
    };
    
    setUser(googleUser);
    setIsGuest(false);
    setIsLoggedIn(true);
    
    // Сохраняем в localStorage
    localStorage.setItem('animeUser', JSON.stringify(googleUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Показываем уведомление
    alert('Вход через Google успешен! Добро пожаловать!');
  };

  // Функция для входа как гость
  const handleGuestLogin = () => {
    const guestUser = {
      name: 'Гость',
      avatar: '👤',
      email: '',
      stats: {
        watched: 15,
        planned: 5,
        dropped: 2,
        friends: 0,
        rating: 45
      },
      status: 'offline',
      bio: 'Я в гостевом режиме. Войдите через Google, чтобы сохранять данные.'
    };
    
    setUser(guestUser);
    setIsGuest(true);
    setIsLoggedIn(false);
    
    localStorage.setItem('animeUser', JSON.stringify(guestUser));
    localStorage.setItem('isLoggedIn', 'false');
  };

  // Функция выхода
  const handleLogout = () => {
    setUser({
      name: 'Гость',
      avatar: '👤',
      email: '',
      stats: {
        watched: 0,
        planned: 0,
        dropped: 0,
        friends: 0,
        rating: 0
      },
      status: 'offline',
      bio: 'Войдите, чтобы сохранять свои списки аниме и персонажей'
    });
    
    setIsGuest(true);
    setIsLoggedIn(false);
    
    localStorage.removeItem('animeUser');
    localStorage.removeItem('isLoggedIn');
    
    setFavorites([]);
    setWatching([]);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const newPostObj = {
        id: posts.length + 1,
        text: newPost,
        time: 'Только что',
        likes: 0,
        comments: 0
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      
      // Если пользователь залогинен, сохраняем пост
      if (isLoggedIn) {
        const updatedUser = { ...user };
        if (!updatedUser.posts) updatedUser.posts = [];
        updatedUser.posts.unshift(newPostObj);
        localStorage.setItem('animeUser', JSON.stringify(updatedUser));
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleStatus = () => {
    if (isLoggedIn) {
      setUser(prev => ({
        ...prev,
        status: prev.status === 'online' ? 'offline' : 'online'
      }));
    }
  };

  const handleCharacterClick = (characterId) => {
    navigate(`/character/${characterId}`);
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  const handleListClick = (listName) => {
    navigate(`/my-lists/${listName}`);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <button onClick={handleBack} className="button-incan back-button">
          ← Назад
        </button>
        <h1>{isGuest ? 'Гостевой профиль' : 'Мой профиль'}</h1>
        
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="button-incan logout-button">
              Выйти
            </button>
          ) : (
            <div className="auth-options">
              <button onClick={handleGoogleLogin} className="button-incan login-button">
                <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Войти через Google
              </button>
              <button onClick={handleGuestLogin} className="button-incan guest-button">
                Гостевой режим
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Основная информация профиля */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          <div className="avatar-circle">{user.avatar}</div>
          
          {isLoggedIn && (
            <div className="status-indicator" onClick={toggleStatus}>
              <span className={`status-dot ${user.status}`}></span>
              <span className="status-text">
                {user.status === 'online' ? 'В сети' : 'Не в сети'}
              </span>
            </div>
          )}
          
          {isGuest && (
            <div className="guest-badge">
              <span className="guest-text">Гость</span>
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-name-section">
            <h2>{user.name}</h2>
            {user.email && (
              <p className="profile-email">{user.email}</p>
            )}
          </div>
          
          <p className="profile-bio">{user.bio}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.stats.watched}</span>
              <span className="stat-label">Просмотрено</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.planned}</span>
              <span className="stat-label">В планах</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.friends}</span>
              <span className="stat-label">Друзья</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.stats.rating}</span>
              <span className="stat-label">Рейтинг</span>
            </div>
          </div>
        </div>
      </div>

      {/* Уведомление для гостя */}
      {isGuest && !isLoggedIn && (
        <div className="guest-notification">
          <p>
            ⚠️ Вы в гостевом режиме. 
            <span> <button 
              onClick={handleGoogleLogin} 
              className="inline-login-button"
            >
              Войдите через Google
            </button>, чтобы сохранять данные.</span>
          </p>
        </div>
      )}

      {/* Списки аниме */}
      <div className="profile-lists">
        <div 
          className="list-section"
          onClick={() => handleListClick('planned')}
          style={{ cursor: 'pointer' }}
        >
          <h3>Буду смотреть</h3>
          <div className="list-content">
            {user.stats.planned > 0 ? (
              <div className="list-info">
                <p className="list-count">{user.stats.planned} аниме</p>
                <p className="list-click-hint">Нажмите для просмотра списка →</p>
              </div>
            ) : (
              <p className="empty-list">Список пуст</p>
            )}
          </div>
        </div>
        
        <div 
          className="list-section"
          onClick={() => handleListClick('watching')}
          style={{ cursor: 'pointer' }}
        >
          <h3>Смотрю</h3>
          <div className="list-content">
            {watching.length > 0 ? (
              <div className="list-info">
                <p className="list-count">{watching.length} аниме</p>
                <p className="list-click-hint">Нажмите для просмотра списка →</p>
              </div>
            ) : (
              <p className="empty-list">Список пуст</p>
            )}
          </div>
        </div>
        
        <div 
          className="list-section"
          onClick={() => handleListClick('dropped')}
          style={{ cursor: 'pointer' }}
        >
          <h3>Забросил</h3>
          <div className="list-content">
            {user.stats.dropped > 0 ? (
              <div className="list-info">
                <p className="list-count">{user.stats.dropped} аниме</p>
                <p className="list-click-hint">Нажмите для просмотра списка →</p>
              </div>
            ) : (
              <p className="empty-list">Список пуст</p>
            )}
          </div>
        </div>
      </div>

      {/* Раздел активности */}
      <div className="profile-activity">
        <div className="activity-section">
          <h3>Мои вайфу</h3>
          <div className="favorites-grid">
            {favorites.map(character => (
              <div 
                key={character.id} 
                className="favorite-item"
                onClick={() => handleCharacterClick(character.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={character.image?.preview || character.image?.x96 || 'https://via.placeholder.com/60x60?text=No+Image'} 
                  alt={character.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                  }}
                />
                <div>
                  <p className="favorite-name">{character.russian || character.name}</p>
                  <p className="favorite-anime">{character.anime}</p>
                </div>
              </div>
            ))}
            {favorites.length === 0 && (
              <p className="empty-list">Добавьте персонажей в избранное</p>
            )}
          </div>
        </div>

        <div className="activity-section">
          <h3>Продолжить просмотр</h3>
          <div className="watching-list">
            {watching.map(item => (
              <div 
                key={item.id} 
                className="watching-item"
                onClick={() => handleAnimeClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="watching-info">
                  <p className="watching-name">{item.name}</p>
                  <p className="watching-episode">Эпизод {item.episode}</p>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
            {watching.length === 0 && (
              <p className="empty-list">Начните смотреть аниме</p>
            )}
          </div>
        </div>
      </div>

      {/* Стена постов */}
      <div className="profile-wall">
        <h3>Стена профиля</h3>
        
        {isLoggedIn && (
          <form onSubmit={handlePostSubmit} className="post-form">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Что у вас нового?"
              rows="3"
              maxLength="500"
            />
            <button type="submit" className="button-incan" disabled={!newPost.trim()}>
              Опубликовать
            </button>
          </form>
        )}

        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <div className="post-avatar">{user.avatar}</div>
                  <div>
                    <p className="post-author">{user.name}</p>
                    <p className="post-time">{post.time}</p>
                  </div>
                </div>
                <p className="post-text">{post.text}</p>
                <div className="post-actions">
                  <button className="action-btn">❤️ {post.likes || 0}</button>
                  <button className="action-btn">💬 {post.comments || 0}</button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-list">Пока нет постов</p>
          )}
        </div>
      </div>

      {/* Информация о входе */}
      {!isLoggedIn && (
        <div className="login-prompt">
          <h3>Хотите сохранить прогресс?</h3>
          <p>Войдите через Google, чтобы:</p>
          <ul>
            <li>Сохранять списки аниме</li>
            <li>Добавлять персонажей в избранное</li>
            <li>Синхронизировать данные между устройствами</li>
            <li>Общаться с другими пользователями</li>
            <li>Создавать посты на стене</li>
          </ul>
          <button onClick={handleGoogleLogin} className="button-incan login-prompt-button">
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;