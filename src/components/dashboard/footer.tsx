'use client';

import {Button } from '@/components/ui/button';
import {useTheme } from 'next-themes';

export function Footer() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          &copy; {currentYear} QR Direct. All rights reserved.
        </p>
        <Button
          variant="ghost"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light Mode' : &apos;Dark Mode&apos;}
        </Button>
      </div>
    </footer>
  );
}
