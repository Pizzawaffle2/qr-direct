// src/hooks/useCalendarSettings.ts
import { useState, useCallback } from 'react';

interface CalendarSettings {
  theme: string;
  frame: string;
  font: string;
}
export function useCalendarSettings(initialSettings?: Partial<CalendarSettings>) {
  const [settings, setSettings] = useState<CalendarSettings>({
    theme: initialSettings?.theme ?? 'default',
    frame: initialSettings?.frame ?? 'none',
    font: initialSettings?.font ?? 'arial'
  });

  const handleSettingsChange = useCallback((newSettings: Partial<CalendarSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  return {
    settings,
    setSettings: handleSettingsChange
  };
}
  
  // Add animations
  const fadeInAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }
  
  // Add styles
  const styles = {
    toolbar: {
      base: "flex flex-wrap gap-6 p-4 border-b transition-colors duration-200",
      theme: {
        default: "border-gray-200/10 bg-gray-900/50",
        minimal: "border-gray-200/5 bg-gray-900/30",
        holiday: "border-red-200/10 bg-gray-900/50"
      }
    },
    select: {
      base: "w-[180px] transition-all duration-200",
      theme: {
        default: "bg-gray-800/50 border-gray-700",
        minimal: "bg-gray-800/30 border-gray-700/50",
        holiday: "bg-red-900/30 border-red-700/50"
      }
    }
  }