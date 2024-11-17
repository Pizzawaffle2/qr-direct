import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    eachWeekOfInterval,
    addDays,
    subDays,
    isSameMonth,
    getWeek,
    format
  } from 'date-fns';
  
  interface CalendarDate {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    weekNumber: number;
  }
  
  export function getCalendarDates(year: number, month: number): CalendarDate[] {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(start);
    
    // Get all weeks that include days in this month
    const weeks = eachWeekOfInterval(
      { start, end },
      { weekStartsOn: 1 } // 1 for Monday, 0 for Sunday
    );
  
    const dates: CalendarDate[] = [];
    weeks.forEach(week => {
      // Get all days in this week
      const weekDates = eachDayOfInterval({
        start: week,
        end: addDays(week, 6)
      });
  
      weekDates.forEach(date => {
        dates.push({
          date,
          isCurrentMonth: isSameMonth(date, start),
          isToday: isSameMonth(date, new Date()) && date.getDate() === new Date().getDate(),
          weekNumber: getWeek(date)
        });
      });
    });
  
    return dates;
  }
  
  export function getHolidays(year: number, month: number): Date[] {
    // Add your holiday calculation logic here
    // You might want to use a holiday API or library
    return [];
  }
  
  export function getLunarPhase(date: Date): string {
    // Add lunar phase calculation logic here
    // You might want to use a lunar phase library
    return '';
  }
  
  export function formatDateForDisplay(date: Date): string {
    return format(date, 'MMMM d, yyyy');
  }
  
  export function getMonthStats(dates: CalendarDate[]) {
    return {
      totalDays: dates.filter(d => d.isCurrentMonth).length,
      weekends: dates.filter(d => d.isCurrentMonth && (d.date.getDay() === 0 || d.date.getDay() === 6)).length,
      firstDay: dates.find(d => d.isCurrentMonth)?.date,
      lastDay: dates.filter(d => d.isCurrentMonth).pop()?.date
    };
  }