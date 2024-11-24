// print-button.tsx
import React from 'react';
import {createPortal } from 'react-dom';
import {Button } from '@/components/ui/button';
import {Printer } from 'lucide-react';
import PrintCalendar from './print-calendar';
import {CalendarTheme } from '@/types/calendar-themes';
import {CalendarEvent } from '@/types/calendar';

interface PrintButtonProps {
  month: number;
  year: number;
  events: CalendarEvent[];
  settings: {
    firstDayOfWeek: 0 | 1;
    showWeekNumbers: boolean;
    showHolidays: boolean;
    showLunarPhases: boolean;
  };
  theme: CalendarTheme;
  title: string;
}

const PrintButton: React.FC<PrintButtonProps> = (props) => {
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handlePrint = React.useCallback(() => {
    setIsPrinting(true);

    // Wait for the print layout to be rendered
    setTimeout(() => {
      window.print();
    }, 100);
  }, []);

  return (
    <>
      <Button variant="outline" size="sm" onClick={handlePrint} className="no-print">
        <Printer className="mr-2 h-4 w-4" />
        Print Calendar
      </Button>

      {isPrinting &&
        createPortal(
          <PrintCalendar {...props} onClose={() => setIsPrinting(false)} />,
          document.body
        )}
    </>
  );
};

export default PrintButton;
