import React, { useEffect, useState } from 'react';

interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [percent, setPercent] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let currentPercent = 0;
    const timer = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 8) + 4;
      if (currentPercent >= 100) {
        currentPercent = 100;
        setPercent(100);
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onFinish();
          }, 500);
        }, 300);
      } else {
        setPercent(currentPercent);
      }
    }, 120);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      id="splash-screen"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0f1d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        overflow: 'hidden',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      <img
        id="splash-img"
        src="https://images.squarespace-cdn.com/content/v1/5fe4caeadae61a2f19719512/1721114243621-3IRPD7LCV3WSYFFUJL9Q/12.gif"
        alt="Splash animation"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.85,
          zIndex: 1,
        }}
      />
      
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(10, 15, 29, 0.75)',
          padding: '24px 36px',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="splash-spinner"
          style={{
            width: '55px',
            height: '55px',
            border: '5px solid rgba(255,255,255,0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
            CLOUD PHONE PRO MAX
          </h2>
          <p id="splash-percent" style={{ color: '#60a5fa', fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 0 0' }}>
            {percent}%
          </p>
        </div>
      </div>
    </div>
  );
};
