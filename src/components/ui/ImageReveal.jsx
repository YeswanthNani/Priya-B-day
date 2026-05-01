import { useRef, useState, useEffect } from 'react';

const ImageReveal = ({ src, alt, delay = 0, aspectRatio = 'video', onError }) => {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const ar = aspectRatio === 'video' ? '16/9' : aspectRatio;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: ar }}>
      {!loaded && <div className="absolute inset-0 image-shimmer bg-white/5" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={onError}
        className={`
          w-full h-full object-cover transition-all duration-1000
          ${visible && loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
        `}
        style={{ transitionDelay: `${delay}ms` }}
      />
    </div>
  );
};

export default ImageReveal;
