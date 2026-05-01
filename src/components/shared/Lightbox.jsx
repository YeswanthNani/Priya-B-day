import { useEffect } from 'react';

const Lightbox = ({ isOpen, onClose, image, caption, currentIndex, totalCount, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/97 backdrop-blur-2xl z-[10000] flex items-center justify-center fade-in"
      onClick={onClose}
    >
      <button className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl transition-colors z-10" onClick={onClose}>✕</button>
      
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest">
        {currentIndex} / {totalCount}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 text-white/50 hover:text-white text-5xl transition-colors z-10 p-4"
      >‹</button>

      <div className="max-w-4xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={image}
          alt={caption}
          className="max-h-[75vh] max-w-full object-contain mx-auto rounded-xl shadow-2xl cinematic-zoom"
        />
        {caption && (
          <p className="text-center text-white/60 mt-5 font-serif italic text-sm">{caption}</p>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 text-white/50 hover:text-white text-5xl transition-colors z-10 p-4"
      >›</button>
    </div>
  );
};

export default Lightbox;
