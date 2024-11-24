'use client';

import {useEffect, useRef } from 'react';
import {motion } from 'framer-motion';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove&apos;, handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden bg-[#030711]">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] to-[#0f1f3d] opacity-80" />
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-white"
          animate={{
            x: mouseRef.current.x * window.innerWidth,
            y: mouseRef.current.y * window.innerHeight,
          }}
          transition={{
            duration: 2,
            ease: &apos;easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
}
