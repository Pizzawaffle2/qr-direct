// src/lib/calendar/holiday-utils.ts
import {format } from 'date-fns';

export interface Holiday {
  date?: Date;
  month?: number;
  day?: number;
  name: string;
  type: 'federal' | 'religious' | 'cultural' | 'fixed' | 'floating';
  weekDay?: number;
  occurrence?: number;
  daysFromEaster?: number;
  description?: string;
  color?: string;
}

// Federal Holidays with dynamic date calculations
export const US_FEDERAL_HOLIDAYS: Holiday[] = [
  {
    month: 1,
    day: 1,
    name: "New Year's Day",
    type: 'federal',
    description: 'First day of the Gregorian calendar year',
  },
  {
    month: 1,
    weekDay: 1, // Monday
    occurrence: 3, // Third occurrence
    name: 'Martin Luther King Jr. Day',
    type: 'federal',
    description: 'Honoring Dr. King\'s birthday and legacy',
  },
  {
    month: 2,
    weekDay: 1, // Monday
    occurrence: 3, // Third occurrence
    name: "Presidents' Day",
    type: 'federal',
    description: 'Honoring Washington, Lincoln, and all U.S. presidents',
  },
  {
    month: 5,
    weekDay: 1, // Monday
    occurrence: -1, // Last occurrence
    name: 'Memorial Day',
    type: 'federal',
    description: 'Honoring those who died in military service',
  },
  {
    month: 6,
    day: 19,
    name: 'Juneteenth',
    type: 'federal',
    description: 'Commemorating the emancipation of enslaved African Americans',
  },
  {
    month: 7,
    day: 4,
    name: 'Independence Day',
    type: 'federal',
    description: 'Celebrating American independence',
  },
  {
    month: 9,
    weekDay: 1, // Monday
    occurrence: 1, // First occurrence
    name: 'Labor Day',
    type: 'federal',
    description: 'Honoring the American labor movement',
  },
  {
    month: 10,
    weekDay: 1, // Monday
    occurrence: 2, // Second occurrence
    name: 'Columbus Day',
    type: 'federal',
    description: 'Commemorating the arrival of Christopher Columbus',
  },
  {
    month: 11,
    day: 11,
    name: 'Veterans Day',
    type: 'federal',
    description: 'Honoring military veterans',
  },
  {
    month: 11,
    weekDay: 4, // Thursday
    occurrence: 4, // Fourth occurrence
    name: 'Thanksgiving Day',
    type: 'federal',
    description: 'Day of giving thanks and harvest celebration',
  },
  {
    month: 12,
    day: 25,
    name: 'Christmas Day',
    type: 'federal',
    description: 'Christmas celebration',
  },
];

// Additional Cultural and Religious Holidays
export const ADDITIONAL_HOLIDAYS: Holiday[] = [
  {
    month: 2,
    day: 14,
    name: "Valentine's Day",
    type: 'cultural',
    color: '#FF69B4',
  },
  {
    month: 3,
    day: 17,
    name: "St. Patrick's Day",
    type: 'cultural',
    color: '#32CD32',
  },
  {
    month: 10,
    day: 31,
    name: 'Halloween',
    type: 'cultural',
    color: '#FFA500',
  },
  // Add Easter (calculated dynamically)
  {
    name: 'Easter Sunday',
    type: 'religious',
    daysFromEaster: 0,
    color: '#FFD700',
  },
  // Add other religious holidays as needed
];

function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number
): Date {
  const date = new Date(year, month);
  const firstDay = new Date(year, month, 1);
  
  if (occurrence > 0) {
    const dayOffset = (weekday - firstDay.getDay() + 7) % 7;
    date.setDate(1 + dayOffset + (occurrence - 1) * 7);
  } else {
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = lastDay.getDay();
    const dayOffset = (weekday - lastDayOfWeek + 7) % 7;
    date.setDate(lastDay.getDate() - (6 - dayOffset) + (occurrence + 1) * 7);
  }
  
  return date;
}

export function getHolidaysForMonth(
  year: number,
  month: number,
  holidayTypes: Array<Holiday['type']> = ['federal', 'cultural', 'religious']
): Holiday[] {
  const allHolidays = [...US_FEDERAL_HOLIDAYS, ...ADDITIONAL_HOLIDAYS]
    .filter(holiday => holidayTypes.includes(holiday.type));

  return allHolidays.map(holiday => {
    let date: Date;

    if (holiday.daysFromEaster) {
      const easter = getEasterDate(year);
      date = new Date(easter);
      date.setDate(easter.getDate() + holiday.daysFromEaster);
    } else if (holiday.weekDay !== undefined && holiday.occurrence !== undefined) {
      date = getNthWeekdayOfMonth(year, month - 1, holiday.weekDay, holiday.occurrence);
    } else if (holiday.month === month && holiday.day) {
      date = new Date(year, month - 1, holiday.day);
    } else {
      return null;
    }

    return {
      ...holiday,
      date,
    };
  }).filter((holiday): holiday is Holiday & { date: Date } => 
    holiday !== null && 
    holiday.date.getMonth() === month - 1
  );
}

export function isHoliday(
  date: Date,
  holidayTypes: Array<Holiday['type']> = ['federal', 'cultural', 'religious']
): Holiday | null {
  const month = date.getMonth() + 1;
  const holidays = getHolidaysForMonth(date.getFullYear(), month, holidayTypes);
  
  return holidays.find(holiday => 
    format(holiday.date!, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  ) || null;
}

export function getUpcomingHolidays(
  date: Date = new Date(),
  limit: number = 5,
  holidayTypes: Array<Holiday['type']> = ['federal', 'cultural', 'religious']
): Holiday[] {
  const currentYear = date.getFullYear();
  const nextYear = currentYear + 1;
  
  // Get holidays for current and next year
  const currentYearHolidays = Array.from({ length: 12 }, (_, i) => i + 1)
    .flatMap(month => getHolidaysForMonth(currentYear, month, holidayTypes));
  
  const nextYearHolidays = Array.from({ length: 12 }, (_, i) => i + 1)
    .flatMap(month => getHolidaysForMonth(nextYear, month, holidayTypes));

  return [...currentYearHolidays, ...nextYearHolidays]
    .filter(holiday => holiday.date! >= date)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())
    .slice(0, limit);
}