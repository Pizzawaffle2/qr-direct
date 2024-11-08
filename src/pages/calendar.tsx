// src/pages/calendar.tsx

import { useRef, useState } from "react";
import { CalendarGrid } from "../components/calendar/calendar-grid";
import { CalendarToolbar } from "../components/calendar/calendar-toolbar";
import { CalendarExport } from "../components/calendar/calendar-export";

const CalendarPage = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (theme: string) => {
    console.log("Selected theme:", theme);
  };

  const handleFrameChange = (frame: string) => {
    console.log("Selected frame:", frame);
  };

  const handleFontChange = (font: string) => {
    console.log("Selected font:", font);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Calendar Generator</h1>
      <CalendarToolbar
        onThemeChange={handleThemeChange}
        onFrameChange={handleFrameChange}
        onFontChange={handleFontChange}
      />
      <div ref={calendarRef} className="my-4 p-4 border rounded">
        <CalendarGrid month={month} year={year} onSelectDate={(date) => console.log("Selected date:", date)} />
      </div>
      <CalendarExport calendarRef={calendarRef} />
    </div>
  );
};

export default CalendarPage;
