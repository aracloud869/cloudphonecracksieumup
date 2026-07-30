import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameApp } from '../types';
import { GAME_CATEGORIES } from '../defaultData';
import { Translations } from '../languages';

interface ExploreTabProps {
  games: GameApp[];
  categories?: { value: string; label: string }[];
  onOpenGame: (game: GameApp | string) => void;
  onShowAllGames: () => void;
  t: Translations;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  games,
  categories,
  onOpenGame,
  onShowAllGames,
  t,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoriesList = categories && categories.length > 0 ? categories : GAME_CATEGORIES;

  const filteredGames = games.filter((g) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      (g.desc && g.desc.toLowerCase().includes(q)) ||
      (g.tag && g.tag.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' ||
      (g.tag && g.tag.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (g.desc && g.desc.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const openDiscordLink = () => {
    window.open('https://discord.gg/', '_blank');
  };

  return (
    <div id="tab-explore" className="tab-content active">
      <div className="header-area">
        <h2 className="header-title">{t.exploreTitle}</h2>
      </div>

      <input
        id="search-game"
        className="search-input"
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category Pills Filter */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          marginBottom: '18px',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            border: selectedCategory === 'all' ? '1px solid #2563eb' : '1px solid var(--input-border)',
            padding: '7px 16px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            background: selectedCategory === 'all' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'var(--input-bg)',
            color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-sub)',
            boxShadow: selectedCategory === 'all' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          🎮 Tất cả ({games.length})
        </button>
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(isActive ? 'all' : cat.value)}
              style={{
                border: isActive ? '1px solid #2563eb' : '1px solid var(--input-border)',
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'var(--input-bg)',
                color: isActive ? '#ffffff' : 'var(--text-sub)',
                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="game-list-horizontal" id="game-horizontal">
        {filteredGames.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '10px 0', fontSize: '0.9rem' }}>
            {t.noGameFound} "{searchTerm}"
          </div>
        ) : (
          <AnimatePresence>
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="game-card"
                onClick={() => onOpenGame(game)}
              >
                <div className="game-card-img">
                  <img
                    src={game.icon}
                    alt={game.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://cdn-icons-png.flaticon.com/512/3081/3081329.png';
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                  }}
                >
                  {game.name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <motion.div
        whileHover={{ y: -2 }}
        className="info-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3>
            <i
              className="fas fa-layer-group"
              style={{ color: '#2563eb', marginRight: '6px' }}
            ></i>
            {t.allGamesTitle} ({games.length})
          </h3>
          <p className="text-muted" style={{ marginTop: '6px' }}>
            {t.allGamesDesc}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="btn-add-device btn-view-games"
          onClick={onShowAllGames}
        >
          <i className="fas fa-th"></i> {t.viewBtn}
        </motion.button>
      </motion.div>

      <motion.div
        whileHover={{ y: -2 }}
        className="info-card"
        onClick={openDiscordLink}
        style={{ cursor: 'pointer' }}
      >
        <h3>
          <i
            className="fab fa-discord"
            style={{ color: '#5865F2', marginRight: '6px' }}
          ></i>
          {t.discordTitle}
        </h3>
        <p className="text-muted" style={{ marginTop: '6px' }}>
          {t.discordDesc}
        </p>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="info-card">
        <h3>
          <i
            className="fas fa-gift"
            style={{ color: '#ec4899', marginRight: '6px' }}
          ></i>
          {t.eventTitle}
        </h3>
        <p className="text-muted" style={{ marginTop: '6px' }}>
          {t.eventDesc}
        </p>
      </motion.div>
    </div>
  );
};


