import { useEffect, useRef } from 'react';

export const spawnHearts = (container, count = 30) => {
  if (!container) return;
  const emojis = ['🩵', '💙', '✨', '🫂', '🌟', '💫', '💕'];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: 0;
        font-size: ${Math.random() * 20 + 16}px;
        animation: floatHeart ${Math.random() * 3 + 3}s ease-out forwards;
        pointer-events: none;
        filter: drop-shadow(0 0 8px rgba(232,121,160,0.5));
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, i * 80);
  }
};

const FloatingHearts = ({ count = 3, interval = 3000 }) => {
  const containerRef = useRef(null);
  const emojis = ['🩵', '💙', '✨', '🦋', '💫'];

  useEffect(() => {
    const spawn = () => {
      if (!containerRef.current) return;
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.className = 'floating-heart';
      el.style.cssText = `
        left: ${Math.random() * 80 + 10}%;
        bottom: 5%;
        font-size: ${Math.random() * 16 + 14}px;
        animation-duration: ${Math.random() * 4 + 5}s;
      `;
      containerRef.current.appendChild(el);
      setTimeout(() => el.remove(), 9000);
    };

    const id = setInterval(spawn, interval);
    return () => clearInterval(id);
  }, [interval]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
};

export default FloatingHearts;
