import { useState, useRef } from 'react';

const CinematicImage = ({ src, alt, caption, emotion, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);

  return (
    /* card-glow: the ::before spins the beam, ::after covers center,
       leaving only a glowing border ring — exactly like the reference */
    <div
      className="masonry-item card-glow"
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
    >
      {/* inner content — sits above ::after via z-index */}
      <div
        className="card-glow-content group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-500"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!loaded && (
          <div className="absolute inset-0 image-shimmer bg-white/5" style={{ aspectRatio: index % 3 === 0 ? '3/4' : '4/3' }} />
        )}

        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${index}/600/800`; setLoaded(true); }}
          className={`
            w-full object-cover transition-all duration-700
            ${loaded ? 'opacity-100' : 'opacity-0'}
            ${hovered ? 'scale-105 brightness-90' : 'scale-100'}
          `}
          style={{ transitionDuration: '600ms' }}
        />

        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
          flex flex-col justify-end p-4 md:p-5
          transition-opacity duration-400
          ${hovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <span className="text-[9px] uppercase tracking-widest text-pink-400/80 mb-1">{emotion}</span>
          <p className="text-white text-sm font-light leading-snug font-serif italic">{caption}</p>
        </div>

        <div className={`
          absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm
          flex items-center justify-center text-white/80 text-xs
          transition-all duration-300
          ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        `}>
          ⊕
        </div>
      </div>
    </div>
  );
};

export default CinematicImage;
