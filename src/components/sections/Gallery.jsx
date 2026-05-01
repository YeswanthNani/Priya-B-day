import { useState, useCallback, useEffect, useRef } from 'react';
import MEMORIES from '../../constants/memories';
import CinematicImage from '../ui/CinematicImage';
import Lightbox from '../shared/Lightbox';

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((i) => { setCurrentIndex(i); setLightboxOpen(true); }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const handlePrev = useCallback(() => setCurrentIndex(p => (p - 1 + MEMORIES.length) % MEMORIES.length), []);
  const handleNext = useCallback(() => setCurrentIndex(p => (p + 1) % MEMORIES.length), []);

  return (
    <section id="gallery" ref={sectionRef} className="section py-24 bg-[#050507] relative">
      
     
      <div className={`text-center mb-20 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <span className="section-badge text-pink-300/80 border-pink-500/20 bg-pink-500/8">Chapter 01 • Memories</span>
        <h2 className="cinema-title text-5xl md:text-7xl text-white mt-4 mb-4 tracking-tight">
          Every moment
          <span className="block gradient-text-rose italic font-light">captured</span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto font-light text-sm leading-relaxed">
          A collection of frames that tell stories without words
        </p>
      </div>

     
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 masonry-grid">
          {MEMORIES.map((memory, index) => (
            <CinematicImage
              key={memory.id}
              src={memory.url}
              alt={memory.caption}
              caption={memory.caption}
              emotion={memory.emotion}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

     
        <div className={`
          mt-20 flex justify-center gap-16 md:gap-24 flex-wrap border-t border-white/5 pt-14
          transition-all duration-1000 delay-300
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          {[
            { num: `${MEMORIES.length}+`, label: 'Captured Moments' },
            { num: '∞', label: 'Stories Untold' },
            { num: '1', label: 'Extraordinary Person' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center group">
              <div className="text-5xl md:text-6xl font-light gradient-text mb-2 counter group-hover:scale-110 transition-transform duration-500">{num}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-[0.25em]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        image={MEMORIES[currentIndex]?.url}
        caption={MEMORIES[currentIndex]?.caption}
        currentIndex={currentIndex + 1}
        totalCount={MEMORIES.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};

export default Gallery;
