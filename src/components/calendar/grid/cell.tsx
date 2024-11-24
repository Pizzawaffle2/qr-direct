// src/components/calendar/grid/cell.tsx
import {memo } from 'react';
import {format } from 'date-fns';
import {motion } from 'framer-motion';
import {cn } from '@/lib/utils';

interface CalendarCellProps {
  date: {
    date: Date;
    isDisabled: boolean;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
  };
  onSelect: (date: Date) => void;
}

export const CalendarCell = memo(({ date, onSelect }: CalendarCellProps) => {
  const handleClick = () => {
    if (!date.isDisabled) {
      onSelect(date.date);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={date.isDisabled}
      whileHover={{ scale: date.isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: date.isDisabled ? 1 : 0.95 }}
      className={cn(
        'relative aspect-square w-full p-1',
        'rounded-lg transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
        date.isSelected && 'bg-blue-500 text-white',
        !date.isSelected && !date.isDisabled && 'hover:bg-gray-100',
        date.isToday && !date.isSelected && 'font-semibold text-blue-600'
      )}
    >
      <span className="text-sm">{format(date.date, &apos;d&apos;)}</span>

      {date.isToday && !date.isSelected && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
        </div>
      )}
    </motion.button>
  );
});

CalendarCell.displayName = 'CalendarCell';
