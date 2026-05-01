
import { useState, useEffect } from 'react';

export const useCountdown = (birthDate) => {
  const [countdown, setCountdown] = useState({
    age: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const birth = new Date(birthDate);
      const today = new Date();
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      
      let nextBirthday = new Date(today.getFullYear(), 4, 2); 
      if (nextBirthday <= today) {
        nextBirthday = new Date(today.getFullYear() + 1, 4, 2);
      }

      const diff = nextBirthday - today;
      
      setCountdown({
        age: age + 1, 
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [birthDate]);

  return countdown;
};

export default useCountdown;