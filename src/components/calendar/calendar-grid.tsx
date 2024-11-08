// src/components/calendar/calendar-grid.tsx

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, addDays } from "date-fns";

interface CalendarGridProps {
  month: number;
  year: number;
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid = ({ month, year, onSelectDate }: CalendarGridProps) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(start);
    let current = start;

    const days: Date[] = [];
    while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
    }
    setDates(days);
  }, [month, year]);

  return (
    <div className="grid grid-cols-7 gap-2 p-4 border rounded-lg bg-white">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-semibold">
          {day}
        </div>
      ))}
      {dates.map((date) => (
        <div
          key={date.toISOString()}
          className="p-4 border rounded cursor-pointer hover:bg-gray-200"
          onClick={() => onSelectDate(date)}
        >
          {format(date, "d")}
        </div>
      ))}
    </div>
  );
};
