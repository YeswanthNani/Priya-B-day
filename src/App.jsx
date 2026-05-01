import { useState, useRef, useCallback } from 'react';
import './styles/globals.css';

import CustomCursor from './components/shared/CustomCursor';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Gallery from './components/sections/Gallery';
import Timeline from './components/sections/Timeline';
import WhyYou from './components/sections/WhyYou';
import VoiceNotes from './components/sections/VoiceNotes';
import Quiz from './components/sections/Quiz';
import FinalGift from './components/sections/FinalGift';

const App = () => {
  const bgMusicRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = useCallback(() => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = document.getElementById('bg-music');
    }
    if (isMusicPlaying) {
      bgMusicRef.current?.pause();
    } else {
      bgMusicRef.current?.play().catch(() => console.log('Audio autoplay blocked'));
    }
    setIsMusicPlaying(prev => !prev);
  }, [isMusicPlaying]);

  const handleJourneyStart = useCallback(() => {
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth' });
    if (!isMusicPlaying) toggleMusic();
  }, [isMusicPlaying, toggleMusic]);

  return (
    <div className="relative bg-[#060608] min-h-screen text-white selection:bg-pink-500/30 selection:text-white fix-width">
      
     
      <div className="film-grain" />

     
      <CustomCursor />

   
      <audio id="bg-music" loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" type="audio/mpeg" />
      </audio>

     
      <Navbar onMusicToggle={toggleMusic} isMusicPlaying={isMusicPlaying} />

     
      <main className="fix-width relative z-10">
        <Hero onJourneyStart={handleJourneyStart} onMusicToggle={toggleMusic} />
        <Gallery />
        <Timeline />
        <WhyYou />
        <VoiceNotes />
        <Quiz />
        <FinalGift />
      </main>
    </div>
  );
};

export default App;
