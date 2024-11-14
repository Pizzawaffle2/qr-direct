// src/lib/calendar/calendar-utils.ts
import type { 
    CalendarSettings, 
    CalendarEvent, 
    Holiday, 
    LunarPhase 
  } from '@/types/calendar';
  
  // Calendar date utilities
  export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };
  
  export const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };
  
  export const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };
  
  // Lunar phase utilities
  const LUNAR_CYCLE = 29.53059; // days
  const KNOWN_NEW_MOON = new Date(2000, 0, 6); // Known new moon date
  
  export const getLunarPhase = (date: Date): LunarPhase => {
    const elapsed = date.getTime() - KNOWN_NEW_MOON.getTime();
    const days = elapsed / (1000 * 60 * 60 * 24);
    const phase = ((days % LUNAR_CYCLE) / LUNAR_CYCLE) * 360;
  
    let lunarPhase: LunarPhase['phase'];
    if (phase < 45) lunarPhase = 'new';
    else if (phase < 135) lunarPhase = 'first-quarter';
    else if (phase < 225) lunarPhase = 'full';
    else if (phase < 315) lunarPhase = 'last-quarter';
    else lunarPhase = 'new';
  
    return {
      date: new Date(date),
      phase: lunarPhase
    };
  };
  
  export const getLunarPhaseEmoji = (phase: LunarPhase['phase']): string => {
    const phases = {
      'new': '🌑',
      'first-quarter': '🌓',
      'full': '🌕',
      'last-quarter': '🌗'
    };
    return phases[phase];
  };
  
  // Event utilities
  export const sortEvents = (events: CalendarEvent[]): CalendarEvent[] => {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  export const filterEventsByMonth = (
    events: CalendarEvent[], 
    year: number, 
    month: number
  ): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
    });
  };
  
  export const getEventColor = (event: CalendarEvent, settings: CalendarSettings): string => {
    if (event.color) return event.color;
    
    const defaultColors = {
      holiday: settings.theme.accentColor,
      event: settings.theme.headerColor,
      reminder: settings.theme.textColor
    };
    
    return defaultColors[event.type];
  };
  
  // Theme utilities
  export const generateThemeStyles = (settings: CalendarSettings): Record<string, string> => {
    return {
      '--calendar-header-color': settings.theme.headerColor,
      '--calendar-bg-color': settings.theme.backgroundColor,
      '--calendar-text-color': settings.theme.textColor,
      '--calendar-accent-color': settings.theme.accentColor,
    };
  };
  
  // Validation utilities
  export const validateSettings = (settings: Partial<CalendarSettings>): CalendarSettings => {
    const defaultSettings: CalendarSettings = {
      title: 'My Calendar',
      type: 'personal',
      year: new Date().getFullYear(),
      firstDayOfWeek: 0,
      showWeekNumbers: false,
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      theme: {
        headerColor: '#2563eb',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#3b82f6'
      },
      options: {
        showHolidays: true,
        showLunarPhases: false,
        showWeather: false,
        showNotes: true
      }
    };
  
    return {
      ...defaultSettings,
      ...settings,
      theme: { ...defaultSettings.theme, ...settings.theme },
      options: { ...defaultSettings.options, ...settings.options }
    };
  };
  
  // Date formatting utilities
  export const formatMonthYear = (year: number, month: number): string => {
    return new Date(year, month - 1).toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  export const formatDate = (date: Date): string => {
    return date.toLocaleString('default', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Grid utilities
  export const generateMonthGrid = (
    year: number, 
    month: number, 
    firstDayOfWeek: 0 | 1
  ): (number | null)[] => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const grid: (number | null)[] = [];
  
    // Adjust first day based on week start preference
    const adjustedFirstDay = (firstDay - firstDayOfWeek + 7) % 7;
  
    // Add empty cells for days before the first of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      grid.push(null);
    }
  
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }
  
    // Add empty cells to complete the last week if needed
    const remainingCells = (7 - (grid.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      grid.push(null);
    }
  
    return grid;
  };
  
  // Export settings for different calendar types
  export const CALENDAR_TYPE_PRESETS: Record<CalendarSettings['type'], Partial<CalendarSettings>> = {
    personal: {
      theme: {
        headerColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#60a5fa'
      },
      options: {
        showHolidays: true,
        showLunarPhases: false,
        showWeather: false,
        showNotes: true
      }
    },
    business: {
      theme: {
        headerColor: '#1f2937',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        accentColor: '#4b5563'
      },
      options: {
        showHolidays: true,
        showLunarPhases: false,
        showWeather: false,
        showNotes: false
      }
    },
    holiday: {
      theme: {
        headerColor: '#dc2626',
        backgroundColor: '#fff1f2',
        textColor: '#991b1b',
        accentColor: '#f87171'
      },
      options: {
        showHolidays: true,
        showLunarPhases: true,
        showWeather: false,
        showNotes: true
      }
    }
  };