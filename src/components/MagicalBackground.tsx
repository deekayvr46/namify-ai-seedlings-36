
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

interface FallingStar {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

const MagicalBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [fallingStars, setFallingStars] = useState<FallingStar[]>([]);

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

    generateStars();
  }, []);

  useEffect(() => {
    // Generate falling stars periodically
    const generateFallingStar = () => {
      const newFallingStar: FallingStar = {
        id: Date.now() + Math.random(),
        x: Math.random() * 120 - 20, // Start slightly off screen
        y: -10,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * 30 + 15, // 15-45 degree angle
        opacity: Math.random() * 0.8 + 0.2,
        trail: []
      };
      
      setFallingStars(prev => [...prev, newFallingStar]);
    };

    // Create falling stars every 3-8 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance each interval
        generateFallingStar();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate falling stars
    const animateStars = () => {
      setFallingStars(prev => 
        prev.map(star => {
          const newX = star.x + Math.cos(star.angle * Math.PI / 180) * star.speed;
          const newY = star.y + Math.sin(star.angle * Math.PI / 180) * star.speed;
          
          // Add to trail
          const newTrail = [...star.trail, { x: star.x, y: star.y, opacity: star.opacity }];
          if (newTrail.length > 8) newTrail.shift(); // Keep trail length manageable
          
          return {
            ...star,
            x: newX,
            y: newY,
            trail: newTrail.map((point, index) => ({
              ...point,
              opacity: point.opacity * (index / newTrail.length) * 0.5
            }))
          };
        }).filter(star => star.x < 120 && star.y < 120) // Remove stars that are off screen
      );
    };

    const animationInterval = setInterval(animateStars, 50);
    return () => clearInterval(animationInterval);
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

      {/* Animated falling stars */}
      {fallingStars.map((star) => (
        <div key={star.id}>
          {/* Star trail */}
          {star.trail.map((point, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${star.size * 0.5}px`,
                height: `${star.size * 0.5}px`,
                opacity: point.opacity,
                boxShadow: `0 0 ${star.size}px rgba(255,255,255,${point.opacity})`
              }}
            />
          ))}
          
          {/* Main falling star */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px white, 0 0 ${star.size * 6}px rgba(255,255,255,0.5)`,
              transform: `rotate(${star.angle}deg)`
            }}
          />
        </div>
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
    </div>
  );
};

export default MagicalBackground;
