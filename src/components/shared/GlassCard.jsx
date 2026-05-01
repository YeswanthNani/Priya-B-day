import { useRef, useState } from 'react';

const GlassCard = ({ children, className = '', hover3D = true, glowOnHover = true }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!hover3D || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) / (r.width/2);
    const y = (e.clientY - r.top - r.height/2) / (r.height/2);
    setTransform(`perspective(1000px) rotateX(${-y*8}deg) rotateY(${x*8}deg) scale3d(1.02,1.02,1.02)`);
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const onLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  };

  return (
    <div
      ref={cardRef}
      className={`relative glass rounded-3xl overflow-hidden transition-all duration-300 ease-out ${glowOnHover ? 'hover:shadow-[0_0_40px_-10px_rgba(232,121,160,0.2)]' : ''} ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
        style={{ background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.05), transparent 40%)` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
