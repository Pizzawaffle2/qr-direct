import React, { useEffect, useState } from 'react';
import {format } from 'date-fns';
import {CalendarTheme } from '@/types/calendar-themes';
import {CalendarEvent } from '@/types/calendar';
import {ThemeFrame } from './calendar-frames';
import {DefaultSession } from 'next-auth';
import {SubscriptionStatus, UserRole } from '@/types/user';

declare module 'next-auth' {
  interface User {
    subscriptionStatus: SubscriptionStatus;
    subscriptionTier?: string;
  }
}

interface PrintCalendarProps {
  month: number;
  year: number;
  events: CalendarEvent[];
  settings: {
    firstDayOfWeek: 0 | 1;
    showWeekNumbers?: boolean;
  };
  theme: CalendarTheme;
  title: string;
  onClose: () => void;
  user?: DefaultSession['user'] & {
    id: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    subscriptionTier?: string;
  };
}

const PrintCalendar: React.FC<PrintCalendarProps> = ({
  month,
  year,
  events,
  settings,
  theme,
  title,
  onClose,
  user,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isPro = user?.subscriptionStatus === 'active';

  useEffect(() => {
    setIsMounted(true);
    document.body.classList.add('printing-calendar');

    const handlePrintComplete = () => {
      document.body.classList.remove('printing-calendar');
      onClose();
    };

    window.addEventListener('afterprint', handlePrintComplete);

    return () => {
      document.body.classList.remove('printing-calendar');
      window.removeEventListener('afterprint', handlePrintComplete);
    };
  }, [onClose]);

  const generateCalendarData = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const weeks: number[][] = [];
    let currentWeek: number[] = [];

    const offset = (firstDayOfMonth - settings.firstDayOfWeek + 7) % 7;
    for (let i = 0; i < offset; i++) {
      currentWeek.push(0);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = generateCalendarData();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday&apos;];
  if (settings.firstDayOfWeek === 1) {
    dayNames.push(dayNames.shift()!);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="print-calendar-wrapper">
      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          html * {
            visibility: hidden;
          }

          html {
            background: white !important;
          }

          body {
            visibility: visible;
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            line-height: 1.4;
            background: white !important;
            color: black;
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Show only our calendar content */
          .print-calendar-wrapper,
          .print-calendar-wrapper * {
            visibility: visible;
          }

          .print-calendar-wrapper {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: max-content;
            background: white;
            padding: 0;
            margin: 0;
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          /* Hide all other content */
          body > *:not(.print-calendar-wrapper) {
            display: none !important;
          }

          @page {
            size: landscape;
            margin: 0.5in;
          }

          .print-calendar {
            position: relative;
            background: white;
            width: 100%;
            height: max-content;
            overflow: visible;
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          /* Watermark */
          .watermark {
            display: ${isPro ? &apos;none' : 'block'};
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 6em;
            font-weight: bold;
            font-family: ${theme.typography.fontFamily};
            color: rgba(0, 0, 0, 0.08);
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
            width: 100%;
            text-align: center;
          }

          /* Calendar Container */
          .calendar-frame {
            border-radius: 12px;
            overflow: hidden;
            background-color: ${theme.colors.background} !important;
            border: 1px solid ${theme.colors.border};
          }

          /* Table Styles */
          .calendar-table {
            width: 100%;
            border-collapse: separate !important;
            border-spacing: 0;
            border-radius: 12px;
            overflow: hidden;
            background-color: ${theme.colors.background} !important;
          }

          /* Header Cells */
          .calendar-header {
            background-color: ${theme.colors.primary} !important;
            color: ${theme.colors.background} !important;
            font-size: ${theme.typography.headerSize} !important;
            font-weight: 600;
            padding: 12px 8px;
            text-align: center;
            border: 1px solid ${theme.colors.border};
          }

          /* Calendar Days */
          .calendar-day {
            border: 1px solid ${theme.colors.border} !important;
            vertical-align: top !important;
            height: 90px !important;
            padding: 8px !important;
            background-color: ${theme.colors.background} !important;
            position: relative !important;
          }

          /* Day Numbers */
          .day-number {
            font-size: ${theme.typography.dateSize} !important;
            color: ${theme.colors.text} !important;
            font-weight: 500 !important;
            margin-bottom: 6px !important;
            position: relative !important;
            z-index: 1 !important;
          }

          /* Events List Container */
          .events-list {
            position: relative !important;
            z-index: 1 !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
          }

          /* Event Items */
          .event-item {
            font-size: 9pt !important;
            line-height: 1.2 !important;
            margin: 1px 0 !important;
            padding: 3px 6px !important;
            background-color: ${theme.colors.secondary}15 !important;
            color: ${theme.colors.text} !important;
            border-left: 3px solid ${theme.colors.accent} !important;
            border-radius: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 100% !important;
          }

          /* Empty Days */
          .empty-day {
            background-color: ${theme.colors.secondary}05 !important;
          }

          /* Rounded Corners */
          .calendar-table th:first-child {
            border-top-left-radius: 11px !important;
          }

          .calendar-table th:last-child {
            border-top-right-radius: 11px !important;
          }

          .calendar-table tr:last-child td:first-child {
            border-bottom-left-radius: 11px !important;
          }

          .calendar-table tr:last-child td:last-child {
            border-bottom-right-radius: 11px !important;
          }

          /* Header Section */
          .calendar-header-section {
            text-align: center !important;
            margin-bottom: 1.5rem !important;
            padding: 0 !important;
          }

          .calendar-title {
            font-size: 28pt !important;
            font-weight: bold !important;
            color: ${theme.colors.primary} !important;
            margin: 0 0 0.25rem 0 !important;
            font-family: ${theme.typography.fontFamily} !important;
            line-height: 1.2 !important;
          }

          .calendar-subtitle {
            font-size: 20pt !important;
            color: ${theme.colors.text} !important;
            margin: 0 !important;
            font-family: ${theme.typography.fontFamily} !important;
            opacity: 0.8 !important;
          }
        }

        /* Hide in normal view */
        .print-calendar-wrapper {
          display: none;
        }

        @media screen {
          .print-calendar-wrapper {
            display: none !important;
          }
        }
      `}</style>

      <div className="print-calendar">
        {!isPro && <div className="watermark">QR Direct</div>}

        <div className="calendar-header-section">
          <h1 className="calendar-title">{title || 'Calendar&apos;}</h1>
          <h2 className="calendar-subtitle">{format(new Date(year, month), &apos;MMMM yyyy')}</h2>
        </div>

        <ThemeFrame
          type={
            theme.frame.type === 'none' ||
            !['basic', 'minimal', 'christmas', 'snowflakes', 'spring', 'summer', 'autumn'].includes(
              theme.frame.type
            )
              ? 'minimal'
              : (theme.frame.type as
                  | 'basic'
                  | 'minimal'
                  | 'christmas'
                  | 'snowflakes'
                  | 'spring'
                  | 'summer'
                  | 'autumn')
          }
          color={theme.colors.primary}
          className="calendar-frame"
        >
          <table className="calendar-table">
            <thead>
              <tr>
                {settings.showWeekNumbers && <th className="calendar-header">Wk</th>}
                {dayNames.map((day) => (
                  <th key={day} className="calendar-header">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {settings.showWeekNumbers && (
                    <td className="calendar-day text-center text-sm">
                      {format(new Date(year, month, week.find((d) => d !== 0) || 1), &apos;w&apos;)}
                    </td>
                  )}
                  {week.map((day, dayIndex) => {
                    const date = day ? new Date(year, month, day) : null;
                    const dayEvents = date
                      ? events.filter((event) => {
                          const eventDate = new Date(event.date);
                          return (
                            eventDate.getDate() === day &&
                            eventDate.getMonth() === month &&
                            eventDate.getFullYear() === year
                          );
                        })
                      : [];

                    return (
                      <td key={dayIndex} className={`calendar-day ${day === 0 ? 'empty-day' : ''}`}>
                        {day !== 0 && (
                          <>
                            <div className="day-number">{day}</div>
                            <div className="events-list">
                              {dayEvents.map((event, eventIndex) => (
                                <div key={eventIndex} className="event-item">
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ThemeFrame>
      </div>
    </div>
  );
};

export default PrintCalendar;
