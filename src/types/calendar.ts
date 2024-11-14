export interface CalendarSettings {
    title: string;
    type: "personal" | "business" | "holiday";
    year: number;
    firstDayOfWeek: 0 | 1;  // 0 for Sunday, 1 for Monday
    showWeekNumbers: boolean;
    months: number[];  // Array of months to include (1-12)
    theme: {
      headerColor: string;
      backgroundColor: string;
      textColor: string;
      accentColor: string;
    };
    options: {
      showHolidays: boolean;
      showLunarPhases: boolean;
      showWeather: boolean;
      showNotes: boolean;
    };
  }
  
  export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: 'holiday' | 'event' | 'reminder';
    color?: string;
  }
  
  export interface Holiday {
    date: Date;
    name: string;
    type: 'federal' | 'religious' | 'observance';
  }
  
  export interface WeatherData {
    date: Date;
    temperature: {
      high: number;
      low: number;
    };
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  }
  
  export interface LunarPhase {
    date: Date;
    phase: 'new' | 'first-quarter' | 'full' | 'last-quarter';
  }