import { useState, useEffect } from 'react';

const navLinks = [
  { id: 'gallery', label: 'Gallery', num: '01' },
  { id: 'timeline', label: 'Timeline', num: '02' },
  { id: 'why', label: 'Why You', num: '03' },
  { id: 'voice', label: 'Messages', num: '04' },
  { id: 'quiz', label: 'Quiz', num: '05' },
];

const Navbar = ({ onMusicToggle, isMusicPlaying }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['hero', 'gallery', 'timeline', 'why', 'voice', 'quiz'];
      const active = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= 100 && bottom > 100;
      });
      if (active) setActiveSection(active);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`
      z-layer-nav top-0 left-0 right-0 transition-all duration-500
      ${scrolled 
        ? 'bg-black/70 backdrop-blur-2xl border-b border-white/5 py-3' 
        : 'bg-transparent py-5'}
    `}>
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
        
        
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-1.5 group"
        >
          <span className="font-serif text-base font-light tracking-widest text-white/90 group-hover:text-white transition-colors">Priya</span>
          <span className="text-pink-400 font-serif text-base">'s</span>
          <span className="font-serif text-base font-light tracking-widest text-white/90 group-hover:text-white transition-colors">Day</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse ml-0.5" />
        </button>

        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ id, label, num }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`
                group flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300
                ${activeSection === id ? 'text-white' : 'text-white/40 hover:text-white/80'}
              `}
            >
              <span className="text-pink-500/60 font-mono text-[9px]">{num}</span>
              {label}
              <div className={`h-px transition-all duration-300 ${activeSection === id ? 'w-full bg-pink-400' : 'w-0 bg-white/40 group-hover:w-full'}`} />
            </button>
          ))}
        </div>

        
        <div className="flex items-center gap-4">
          <button
            onClick={onMusicToggle}
            className={`
              flex items-center gap-2 px-4 h-9 rounded-full text-[11px] tracking-wider
              border transition-all duration-300
              ${isMusicPlaying 
                ? 'border-pink-500/40 bg-pink-500/10 text-pink-300' 
                : 'border-white/10 bg-white/5 text-white/50 hover:text-white/80'}
            `}
          >
            {isMusicPlaying ? (
              <span className="flex gap-px items-end h-3">
                {[1,2,3].map(i => (
                  <span key={i} className="wave-bar w-0.5 rounded bg-pink-400"
                    style={{animationDelay: `${i*0.1}s`, height: `${i*4}px`}} />
                ))}
              </span>
            ) : (
              <span className="text-sm">♪</span>
            )}
            <span className="hidden sm:inline">{isMusicPlaying ? 'Playing' : 'Music'}</span>
          </button>

          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`w-5 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

     
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-8 fade-in">
          {navLinks.map(({ id, label, num }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center gap-3 text-2xl font-serif font-light text-white/70 hover:text-white transition-colors"
            >
              <span className="text-pink-400/60 text-sm font-mono">{num}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
