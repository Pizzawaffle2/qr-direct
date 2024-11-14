// src/lib/calendar/holiday-utils.ts
import type { Holiday } from '@/types/calendar';

export const US_FEDERAL_HOLIDAYS: Holiday[] = [
  {
    date: new Date(new Date().getFullYear(), 0, 1),
    name: "New Year's Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 0, 16), // Third Monday in January
    name: "Martin Luther King Jr. Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 1, 20), // Third Monday in February
    name: "Presidents' Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 4, 29), // Last Monday in May
    name: "Memorial Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 5, 19), // June 19th
    name: "Juneteenth",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 6, 4), // July 4th
    name: "Independence Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 8, 4), // First Monday in September
    name: "Labor Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 9, 9), // Second Monday in October
    name: "Columbus Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 10, 11), // November 11th
    name: "Veterans Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 10, 23), // Fourth Thursday in November
    name: "Thanksgiving Day",
    type: 'federal'
  },
  {
    date: new Date(new Date().getFullYear(), 11, 25), // December 25th
    name: "Christmas Day",
    type: 'federal'
  }
];

export const getHolidaysForMonth = (
  year: number,
  month: number,
  holidayTypes: Array<Holiday['type']> = ['federal']
): Holiday[] => {
  // Adjust dates for the specified year
  const holidays = US_FEDERAL_HOLIDAYS.map(holiday => ({
    ...holiday,
    date: new Date(year, holiday.date.getMonth(), holiday.date.getDate())
  }));

  return holidays.filter(holiday => 
    holiday.date.getMonth() === month - 1 &&
    holidayTypes.includes(holiday.type)
  );
};

export const isHoliday = (date: Date, holidays: Holiday[] = US_FEDERAL_HOLIDAYS): Holiday | undefined => {
  return holidays.find(holiday =>
    holiday.date.getFullYear() === date.getFullYear() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getDate() === date.getDate()
  );
};

export const getUpcomingHolidays = (
  date: Date = new Date(),
  limit: number = 5,
  holidays: Holiday[] = US_FEDERAL_HOLIDAYS
): Holiday[] => {
  return holidays
    .map(holiday => ({
      ...holiday,
      date: new Date(date.getFullYear(), holiday.date.getMonth(), holiday.date.getDate())
    }))
    .filter(holiday => holiday.date >= date)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
};