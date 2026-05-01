

export const fadeInUp = {
  hidden: { opacity: 0, transform: 'translateY(40px)' },
  visible: { 
    opacity: 1, 
    transform: 'translateY(0)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInScale = {
  hidden: { opacity: 0, transform: 'scale(0.9)' },
  visible: { 
    opacity: 1, 
    transform: 'scale(1)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, transform: 'translateX(-60px)' },
  visible: { 
    opacity: 1, 
    transform: 'translateX(0)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, transform: 'translateX(60px)' },
  visible: { 
    opacity: 1, 
    transform: 'translateX(0)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const imageReveal = {
  hidden: { 
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0 
  },
  visible: { 
    clipPath: 'inset(0 0 0 0)',
    opacity: 1,
    transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] }
  }
};