// src/components/calendar/grid/utils.ts
import { 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval,
    isSameMonth,
    isToday as dateFnsIsToday,
    isSameDay,
    isBefore,
    isAfter
  } from 'date-fns'
  
  type CalendarDate = {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
  };

  export const generateCalendarDates = (
    month: number,
    year: number,
    selectedDate?: Date,
    minDate?: Date,
    maxDate?: Date,
    disabledDates: Date[] = []
  ): CalendarDate[] => {
    const start = startOfMonth(new Date(year, month))
    const end = endOfMonth(start)
    
    // Get all dates in the month
    const dates = eachDayOfInterval({ start, end })
  
    // Map dates to CalendarDate objects
    return dates.map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, start),
      isToday: dateFnsIsToday(date),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      isDisabled: 
        (minDate && isBefore(date, minDate)) ||
        (maxDate && isAfter(date, maxDate)) ||
        disabledDates.some(disabled => isSameDay(date, disabled))
    }))
  }
  