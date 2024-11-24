// src/components/calendar/grid/grid.tsx
import {useMemo } from 'react';
import cn from 'classnames';
import {AnimatePresence } from 'framer-motion';
import {CalendarHeader } from './header';
import {CalendarCell } from './cell';
import {generateCalendarDates } from './utils';
import type { CalendarGridProps } from './types';

export function CalendarGrid({
  month,
  year,
  selectedDate,
  minDate,
  maxDate,
  disabledDates = [],
  onSelectDate,
  className,
}: CalendarGridProps) {
  // Generate calendar dates with memoization
  const calendarDates = useMemo(
    () => generateCalendarDates(month, year, selectedDate, minDate, maxDate, disabledDates),
    [month, year, selectedDate, minDate, maxDate, disabledDates]
  );

  return (
    <div className={cn('rounded-lg bg-white shadow-sm', className)}>
      <CalendarHeader />

      <div className="grid grid-cols-7 gap-px p-2">
        <AnimatePresence mode="wait">
          {calendarDates.map((date) => (
            <CalendarCell key={date.date.toISOString()} date={date} onSelect={onSelectDate} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
