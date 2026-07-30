import React from 'react';
import { motion } from 'motion/react';
import { TabType } from '../types';
import { Translations } from '../languages';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isAdminUnlocked: boolean;
  t: Translations;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isAdminUnlocked,
  t,
}) => {
  const tabs: { id: TabType; icon: string; label: string; color?: string }[] = [
    { id: 'home', icon: 'fas fa-gamepad', label: t.homeTab },
    { id: 'devices', icon: 'fas fa-microchip', label: t.devicesTab },
    { id: 'explore', icon: 'fas fa-rocket', label: t.exploreTab },
    { id: 'account', icon: 'fas fa-user-astronaut', label: t.accountTab || 'Tài Khoản' },
    { id: 'settings', icon: 'fas fa-sliders-h', label: t.settingsTab },
  ];

  if (isAdminUnlocked) {
    tabs.push({
      id: 'admin',
      icon: 'fas fa-shield-alt',
      label: t.adminTab,
      color: '#f43f5e',
    });
  }

  return (
    <nav id="bottom-nav">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
            whileTap={{ scale: 0.92 }}
            style={{
              color: isActive
                ? tab.color || '#00f0ff'
                : tab.id === 'admin'
                ? '#f43f5e'
                : '#64748b',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  background: tab.color ? 'rgba(244, 63, 94, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                  border: tab.color ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(0, 240, 255, 0.4)',
                  boxShadow: tab.color ? '0 0 15px rgba(244, 63, 94, 0.25)' : '0 0 15px rgba(0, 240, 255, 0.25)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <motion.i
              className={tab.icon}
              animate={{
                scale: isActive ? 1.15 : 1,
                y: isActive ? -2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};


