
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
}

const MagicalBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    // Generate realistic twinkling stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const starColors = ['#ffffff', '#fff8dc', '#ffe4b5', '#e6e6fa', '#b0e0e6'];
      
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 3 + 1,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
      setStars(newStars);
    };

    // Generate occasional shooting stars
    const generateShootingStars = () => {
      const newShootingStars: ShootingStar[] = [];
      for (let i = 0; i < 3; i++) {
        newShootingStars.push({
          id: i,
          x: Math.random() * 120 - 20,
          y: Math.random() * 40,
          angle: Math.random() * 30 + 20,
          speed: Math.random() * 2 + 1,
          length: Math.random() * 80 + 40,
          opacity: 0
        });
      }
      setShootingStars(newShootingStars);
    };

    generateStars();
    generateShootingStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-900/30 to-blue-900/20" />
      
      {/* Realistic twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}, 0 0 ${star.size * 4}px ${star.color}`,
            opacity: star.brightness,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((shootingStar) => (
        <div
          key={shootingStar.id}
          className="absolute"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
            width: `${shootingStar.length}px`,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            transform: `rotate(${shootingStar.angle}deg)`,
            animation: `shootingStar ${4 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: '0 0 6px rgba(255,255,255,0.8)'
          }}
        />
      ))}

      {/* Distant nebula effects */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          top: '20%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          bottom: '30%',
          right: '15%',
          background: 'radial-gradient(circle, rgba(72,61,139,0.4) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />

      {/* Milky Way effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          transform: 'rotate(-20deg) scale(1.5)',
          filter: 'blur(1px)'
        }}
      />

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes twinkle {
            0%, 100% { 
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes shootingStar {
            0% {
              transform: translateX(-100px) translateY(-100px) rotate(var(--angle, 30deg));
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateX(200px) translateY(200px) rotate(var(--angle, 30deg));
              opacity: 0;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 0.3;
              transform: scale(1.1);
            }
          }
        `
      }} />
    </div>
  );
};

export default MagicalBackground;
