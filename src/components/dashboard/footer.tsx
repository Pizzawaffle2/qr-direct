"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Footer() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          &copy; {currentYear} QR Direct. All rights reserved.
        </p>
        <Button 
          variant="ghost"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </footer>
  );
}
