// src/components/calendar/grid/types.ts
export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled?: boolean;
}

export interface CalendarGridProps {
  month: number;
  year: number;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onSelectDate: (date: Date) => void;
  className?: string;
}
