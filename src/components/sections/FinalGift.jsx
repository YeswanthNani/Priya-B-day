import { useState, useEffect, useRef } from 'react';
import FloatingHearts, { spawnHearts } from '../shared/FloatingHearts';

const StarSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1"
    style={{ shapeRendering:'geometricPrecision', textRendering:'geometricPrecision', imageRendering:'optimizeQuality', fillRule:'evenodd', clipRule:'evenodd' }}
    viewBox="0 0 784.11 815.53">
    <g>
      <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"/>
    </g>
  </svg>
);

const FinalGift = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [giftOpened, setGiftOpened] = useState(false);
  const sectionRef = useRef(null);
  const confettiRef = useRef(null);
  const intervalRef = useRef(null);

  const finalMessages = [
    "You've reached the end of this journey,",
    "but every ending is just a new beginning.",
    "",
    "I made this not just to celebrate your birthday,",
    "but to celebrate you — the person you are,",
    "the impression you've made without even trying.",
    "",
    "Whatever tomorrow brings,",
    "know that someone out there thinks you're extraordinary.",
    "",
    "Happy Birthday, Priya. 🩵✨",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openGift = () => {
    // Always clear previous interval and reset lines before starting
    clearInterval(intervalRef.current);
    setDisplayedLines([]);
    setModalOpen(true);
    setGiftOpened(true);

    spawnHearts(confettiRef.current, 60);

    // Use a local counter ref so closure always reads correct value
    let lineIndex = 0;
    intervalRef.current = setInterval(() => {
      lineIndex++;
      if (lineIndex <= finalMessages.length) {
        setDisplayedLines(finalMessages.slice(0, lineIndex));
      } else {
        clearInterval(intervalRef.current);
      }
    }, 400);
  };

  const closeGift = () => {
    clearInterval(intervalRef.current);
    setModalOpen(false);
    setDisplayedLines([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="section py-28 relative flex items-center justify-center min-h-screen overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 80%, rgba(232,121,160,0.12) 0%, #060608 60%)' }}
      >
        <FloatingHearts count={2} interval={2500} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[200, 350, 500].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full border border-pink-500/8"
              style={{ width: size, height: size, animationDelay: `${i * 1.5}s` }}
            />
          ))}
        </div>

        <div className={`
          text-center z-10 relative px-6
          transition-all duration-1200 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
        `}>
          <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] mb-6 font-light">
            The Final Chapter
          </p>

          <h2 className="cinema-title text-4xl md:text-6xl text-white mb-4 opacity-60">
            Something special
          </h2>
          <p className="text-white/30 font-serif italic mb-14 text-sm">awaits you</p>

          <button className="star-btn" onClick={openGift}>
            <span>{giftOpened ? 'Open Again' : 'Open Your Gift'} 🎁</span>
            <div className="star-1"><StarSVG /></div>
            <div className="star-2"><StarSVG /></div>
            <div className="star-3"><StarSVG /></div>
            <div className="star-4"><StarSVG /></div>
            <div className="star-5"><StarSVG /></div>
            <div className="star-6"><StarSVG /></div>
          </button>

          <p className="mt-10 text-white/25 text-xs font-serif italic">
            "The best gifts are the ones that come from the heart"
          </p>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/97 z-[10000] flex items-center justify-center overflow-y-auto fade-in"
          style={{ backdropFilter: 'blur(30px)' }}
          onClick={(e) => e.target === e.currentTarget && closeGift()}
        >
          <div
            className="relative max-w-2xl w-full px-8 py-16 md:py-20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-12" />

            <h1 className="cinema-title text-5xl md:text-7xl mb-14 gradient-text-warm scale-in">
              Happy Birthday,<br />
              <span className="text-white">Priya Dharshini 💙</span>
            </h1>

            <div className="text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto text-white/85 space-y-4 font-serif">
              {displayedLines.map((line, index) => (
                <p
                  key={index}
                  className="slide-up-fade"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {line === '' ? <br /> : line}
                </p>
              ))}
            </div>

            {displayedLines.length === finalMessages.length && (
              <div className="mt-16 slide-up-fade" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-10" />

                <button className="star-btn" onClick={closeGift}>
                  <span>Close this chapter… for now</span>
                  <div className="star-1"><StarSVG /></div>
                  <div className="star-2"><StarSVG /></div>
                  <div className="star-3"><StarSVG /></div>
                  <div className="star-4"><StarSVG /></div>
                  <div className="star-5"><StarSVG /></div>
                  <div className="star-6"><StarSVG /></div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FinalGift;
