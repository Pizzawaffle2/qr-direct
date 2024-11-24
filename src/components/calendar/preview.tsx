'use client';

import {CalendarSettings } from '@/types/calendar';
import {Calendar as CalendarIcon, Moon, Sun, Cloud } from 'lucide-react';

interface CalendarPreviewProps {
  settings: CalendarSettings;
}

export function CalendarPreview({ settings }: CalendarPreviewProps) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(settings.year, monthIndex);
    const firstDay = getFirstDayOfMonth(settings.year, monthIndex);
    const weeks = [];
    let days = [];

    // Adjust for Monday start if needed
    const startOffset =
      settings.firstDayOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startOffset; i++) {
      days.push(<td key={`empty-${i}`} className="p-2 text-center text-muted-foreground"></td>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <td
          key={day}
          className="relative cursor-pointer p-2 text-center hover:bg-accent/50"
          style={{ color: settings.theme.textColor }}
        >
          <span className="relative z-10">{day}</span>
          {settings.options.showLunarPhases && day % 7 === 0 && (
            <Moon className="absolute right-1 top-1 h-3 w-3 opacity-50" />
          )}
        </td>
      );

      if ((startOffset + day) % 7 === 0) {
        weeks.push(<tr key={`week-${day}`}>{days}</tr>);
        days = [];
      }
    }

    // Add remaining empty cells
    const remainingCells = 7 - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(<td key={`empty-end-${i}`} className="p-2 text-center"></td>);
    }

    if (days.length > 0) {
      weeks.push(<tr key="last-week">{days}</tr>);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (settings.firstDayOfWeek === 1) {
      weekDays.push(weekDays.shift()!);
    }

    return (
      <div
        className="overflow-hidden rounded-lg border"
        style={{ backgroundColor: settings.theme.backgroundColor }}
      >
        <div className="p-3" style={{ backgroundColor: settings.theme.headerColor, color: '#fff' }}>
          <div className="text-lg font-semibold">
            {new Date(settings.year, monthIndex).toLocaleString('default', { month: &apos;long&apos; })}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              {settings.showWeekNumbers && (
                <th className="p-2 text-center text-sm font-normal text-muted-foreground">Wk</th>
              )}
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="p-2 text-center text-sm font-normal"
                  style={{ color: settings.theme.textColor }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
        {settings.options.showNotes && (
          <div className="border-t p-3" style={{ borderColor: settings.theme.headerColor + '20' }}>
            <div className="text-sm text-muted-foreground">Notes</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Year</span>
          <span className="font-medium">{settings.year}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Type</span>
          <span className="font-medium capitalize">{settings.type}</span>
        </div>
      </div>

      {/* Calendar Preview */}
      <div className="space-y-4">
        {settings.months.slice(0, 1).map((monthIndex) => (
          <div key={monthIndex} className="shadow-lg">
            {renderMonth(monthIndex - 1)}
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-md border p-2">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Lunar Phases</span>
          <span className={settings.options.showLunarPhases ? 'text-green-500' : 'text-red-500'}>
            {settings.options.showLunarPhases ? 'On' : 'Off&apos;}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md border p-2">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Holidays</span>
          <span className={settings.options.showHolidays ? &apos;text-green-500' : 'text-red-500'}>
            {settings.options.showHolidays ? 'On' : 'Off'}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md border p-2">
          <Cloud className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Weather</span>
          <span className={settings.options.showWeather ? 'text-green-500' : 'text-red-500'}>
            {settings.options.showWeather ? 'On' : 'Off&apos;}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md border p-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Week Numbers</span>
          <span className={settings.showWeekNumbers ? &apos;text-green-500' : 'text-red-500'}>
            {settings.showWeekNumbers ? 'On' : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
}
