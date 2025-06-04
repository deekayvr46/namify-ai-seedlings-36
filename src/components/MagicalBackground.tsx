
import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
}

interface FallingStar {
  id: number;
  x: number;
  y: number;
  rotation: number;
  duration: number;
  delay: number;
}

const MagicalBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [fallingStars, setFallingStars] = useState<FallingStar[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 80; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 8,
          speed: Math.random() * 3 + 2
        });
      }
      setStars(newStars);
    };

    const generateFallingStars = () => {
      const newFallingStars: FallingStar[] = [];
      for (let i = 0; i < 12; i++) {
        newFallingStars.push({
          id: i,
          x: Math.random() * 120 - 10,
          y: Math.random() * 30 - 10,
          rotation: Math.random() * 45 + 10,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 10
        });
      }
      setFallingStars(newFallingStars);
    };

    generateStars();
    generateFallingStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark Magical Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-800/20 to-pink-800/30 animate-pulse" />
      
      {/* Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.size > 3 ? '#fbbf24' : star.size > 2 ? '#a78bfa' : '#f0abfc',
            boxShadow: `0 0 ${star.size * 2}px ${star.size > 3 ? '#fbbf24' : star.size > 2 ? '#a78bfa' : '#f0abfc'}`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.speed}s`
          }}
        />
      ))}
      
      {/* Falling/Shooting Stars */}
      {fallingStars.map((fallingStar) => (
        <div
          key={fallingStar.id}
          className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
          style={{
            left: `${fallingStar.x}%`,
            top: `${fallingStar.y}%`,
            transform: `rotate(${fallingStar.rotation}deg)`,
            animation: `shooting-star ${fallingStar.duration}s ease-out ${fallingStar.delay}s infinite`,
            boxShadow: '0 0 6px #ffffff, 0 0 12px #a78bfa, 0 0 18px #a78bfa'
          }}
        />
      ))}
      
      {/* Floating Magical Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#a78bfa' : '#f0abfc',
              boxShadow: `0 0 8px ${i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#a78bfa' : '#f0abfc'}`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Mystical Aurora Glows */}
      <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/5 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" 
           style={{ animationDelay: '2s', animationDuration: '5s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" 
           style={{ animationDelay: '1s', animationDuration: '6s' }} />
      
      {/* Constellation Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="constellation" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#f0abfc" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        <path d="M100,100 L200,150 L300,120 L400,180" stroke="url(#constellation)" strokeWidth="1" fill="none" className="animate-pulse"/>
        <path d="M500,200 L600,250 L700,220" stroke="url(#constellation)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }}/>
        <path d="M150,300 L250,350 L350,320 L450,380" stroke="url(#constellation)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '2s' }}/>
      </svg>

      {/* Custom CSS for shooting star animation */}
      <style jsx>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(-50px) translateY(-50px) rotate(var(--rotation));
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(var(--rotation));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MagicalBackground;
