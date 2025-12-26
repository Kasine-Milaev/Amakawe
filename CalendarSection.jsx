// src/components/Calendar/CalendarSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnimeSchedule } from '../../services/scheduleService';

const CalendarSection = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSource, setActiveSource] = useState('auto'); // auto, shikimori, anilist
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAnimeSchedule(activeSource);
        
        // Группируем по датам
        const groupedByDate = {};
        data.forEach(anime => {
          const date = new Date(anime.next_episode_at);
          const formattedDate = date.toLocaleDateString('ru-RU', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric'
          });
          
          if (!groupedByDate[formattedDate]) {
            groupedByDate[formattedDate] = [];
          }
          
          groupedByDate[formattedDate].push(anime);
        });
        
        // Преобразуем в массив для рендера
        const sortedSchedule = Object.entries(groupedByDate)
          .map(([date, animeList]) => ({
            date,
            anime: animeList
          }))
          .sort((a, b) => new Date(a.anime[0].next_episode_at) - new Date(b.anime[0].next_episode_at));
        
        setSchedule(sortedSchedule.slice(0, 7)); // Показываем только 7 дней
        setLastUpdated(new Date());
      } catch (err) {
        setError(`Не удалось загрузить расписание`);
        console.error('Ошибка при загрузке расписания:', err);
        // Даже при ошибке показываем mock-данные
        setSchedule(getMockScheduleGrouped());
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [activeSource]);

  // Группируем mock-данные для отображения
  const getMockScheduleGrouped = () => {
    const mockData = getMockSchedule();
    const grouped = {};
    
    mockData.forEach(anime => {
      const date = new Date(anime.next_episode_at);
      const formattedDate = date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric'
      });
      
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      
      grouped[formattedDate].push(anime);
    });
    
    return Object.entries(grouped)
      .map(([date, animeList]) => ({
        date,
        anime: animeList
      }))
      .sort((a, b) => new Date(a.anime[0].next_episode_at) - new Date(b.anime[0].next_episode_at))
      .slice(0, 7);
  };

  const blossomVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    hover: { scale: 1.05 }
  };

  const petalVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: (index) => ({
      scale: 1,
      rotate: [0, 5, 0],
      transition: {
        delay: index * 0.05 + 0.3,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  };

  if (loading) {
    return (
      <div className="calendar-section">
        <h2 className="calendar-title">
          Календарь выхода новых серий
          <div className="calendar-source-switcher">
            <button 
              className={`source-btn ${activeSource === 'auto' ? 'active' : ''}`}
              onClick={() => setActiveSource('auto')}
            >
              Авто
            </button>
            <button 
              className={`source-btn ${activeSource === 'shikimori' ? 'active' : ''}`}
              onClick={() => setActiveSource('shikimori')}
            >
              Shikimori
            </button>
            <button 
              className={`source-btn ${activeSource === 'anilist' ? 'active' : ''}`}
              onClick={() => setActiveSource('anilist')}
            >
              Anilist
            </button>
          </div>
        </h2>
        <div className="calendar-loading">
          <div className="spinner"></div>
          <p>Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="calendar-section">
        <h2 className="calendar-title">
          Календарь выхода новых серий
          <div className="calendar-source-switcher">
            <button 
              className={`source-btn ${activeSource === 'auto' ? 'active' : ''}`}
              onClick={() => setActiveSource('auto')}
            >
              Авто
            </button>
            <button 
              className={`source-btn ${activeSource === 'shikimori' ? 'active' : ''}`}
              onClick={() => setActiveSource('shikimori')}
            >
              Shikimori
            </button>
            <button 
              className={`source-btn ${activeSource === 'anilist' ? 'active' : ''}`}
              onClick={() => setActiveSource('anilist')}
            >
              Anilist
            </button>
          </div>
        </h2>
        <div className="calendar-empty">
          <p>В ближайшее время новых серий не ожидается</p>
          <p className="last-updated">
            {lastUpdated ? `Последнее обновление: ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="calendar-section">
      <h2 className="calendar-title">
        Календарь выхода новых серий
        <div className="calendar-source-switcher">
          <button 
            className={`source-btn ${activeSource === 'auto' ? 'active' : ''}`}
            onClick={() => setActiveSource('auto')}
          >
            Авто
          </button>
          <button 
            className={`source-btn ${activeSource === 'shikimori' ? 'active' : ''}`}
            onClick={() => setActiveSource('shikimori')}
          >
            Shikimori
          </button>
          <button 
            className={`source-btn ${activeSource === 'anilist' ? 'active' : ''}`}
            onClick={() => setActiveSource('anilist')}
          >
            Anilist
          </button>
        </div>
      </h2>
      
      <div className="blossom-grid">
        {schedule.map((day, index) => {
          // Проверяем, что в day.anime есть хотя бы один элемент
          if (!day.anime || day.anime.length === 0) return null;
          
          return (
            <motion.div
              key={`${day.date}-${index}`}
              custom={index}
              variants={blossomVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="blossom-day"
            >
              <motion.div 
                className="blossom-center"
                variants={petalVariants}
                custom={index}
              >
                {new Date(day.anime[0].next_episode_at).getDate()}
              </motion.div>
              
              <div className="petals-container">
                {day.anime.slice(0, 6).map((anime, petalIndex) => (
                  <motion.div
                    key={`${anime.id}-${petalIndex}`}
                    custom={petalIndex}
                    variants={petalVariants}
                    initial="initial"
                    animate="animate"
                    className="petal"
                    style={{
                      transform: `rotate(${petalIndex * 60}deg) translate(45px) rotate(-${petalIndex * 60}deg)`
                    }}
                    title={`${anime.russian || anime.name} - Эпизод ${anime.next_episode}`}
                  >
                    <img 
                      src={anime.image?.original || 'https://via.placeholder.com/40x56?text=No+Image'}
                      alt={anime.name}
                      className="petal-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x56?text=Image+Failed';
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="day-details">
                <h3>{day.date}</h3>
                <ul className="anime-list">
                  {day.anime.map((anime, idx) => (
                    <li key={`${anime.id}-${idx}`} className="anime-item">
                      <span className="anime-title">{anime.russian || anime.name}</span>
                      <span className="anime-episode">
                        Эпизод {anime.next_episode}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="last-updated">
        {lastUpdated ? `Данные обновлены: ${lastUpdated.toLocaleString()}` : ''}
      </div>
    </section>
  );
};

export default CalendarSection;