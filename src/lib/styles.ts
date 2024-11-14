export const gradients = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
  text: {
    blue: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400',
    purple: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400'
  }
};

export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: 0.2 }
  }
};