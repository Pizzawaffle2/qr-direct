// src/pages/calendar.tsx

import {useRef, useState } from 'react';
import {CalendarGrid} from '../components/calendar/calendar-grid';
import {CalendarToolbar} from '../components/calendar/calendar-toolbar';
import {CalendarExport} from '../components/calendar/calendar-export';

const CalendarPage = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [theme, setTheme] = useState('default');
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    console.log('Selected theme:', theme);
  };

  const handleFrameChange = (frame: string) => {
    console.log('Selected frame:', frame);
  };

  const handleFontChange = (font: string) => {
    console.log('Selected font:&apos;, font);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Calendar Generator</h1>
      <CalendarToolbar
        theme={theme}
        onThemeChange={handleThemeChange}
        onFrameChange={handleFrameChange}
        onFontChange={handleFontChange}
      />
      <div ref={calendarRef} className="my-4 rounded border p-4">
        <CalendarGrid
          month={month}
          year={year}
          onDateSelect={(date: Date) => console.log(&apos;Selected date:', date)}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
        />
      </div>
      <CalendarExport 
        calendarRef={calendarRef}
        theme={theme}
        title="My Calendar"
      />
    </div>
  );
};

export default CalendarPage;
