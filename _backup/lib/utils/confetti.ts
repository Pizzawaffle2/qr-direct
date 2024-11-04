// src/utils/confetti.ts
import confetti from 'canvas-confetti';

// Default options for confetti
const defaultOptions = {
    particleCount: 300,
    angle: 90,
    spread: 360,
    origin: { y: 0.5 },
    colors: ['#99ffcc', '#00ccff', '#ccffff', '#ff66ff'],
};

export const triggerConfetti = (options = {}) => {
  confetti({
    ...defaultOptions,
    ...options,
  });
};
