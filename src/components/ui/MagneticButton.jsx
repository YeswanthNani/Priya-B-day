import { useRef, useState } from 'react';

const MagneticButton = ({ children, onClick, className = '' }) => {
  const btnRef = useRef(null);
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.25;
    const y = (e.clientY - top - height / 2) * 0.25;
    setStyle({ transform: `translate(${x}px, ${y}px)` });
  };

  const onLeave = () => {
    setStyle({ transform: 'translate(0,0)', transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' });
  };

  return (
    <button
      ref={btnRef}
      className={`magnetic-btn cursor-pointer ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
