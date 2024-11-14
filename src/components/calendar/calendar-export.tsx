// src/components/calendar/calendar-export.tsx
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback } from "react";

interface CalendarExportProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  fileName?: string;
  paperSize?: {
    width: number;
    height: number;
  };
}

const DEFAULT_PAPER_SIZE = {
  width: 210, // A4 width in mm
  height: 297 // A4 height in mm
};

export const CalendarExport: React.FC<CalendarExportProps> = ({ 
  calendarRef, 
  fileName = 'calendar.pdf',
  paperSize = DEFAULT_PAPER_SIZE
}) => {
  const exportAsPDF = useCallback(async () => {
    try {
      if (!calendarRef.current) {
        console.error('Calendar reference is not available');
        return;
      }

      const canvas = await html2canvas(calendarRef.current);
      const imageData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF();
      pdf.addImage(
        imageData, 
        "PNG", 
        0, 
        0, 
        paperSize.width, 
        paperSize.height
      );
      pdf.save(fileName);
    } catch (error) {
      console.error('Failed to export calendar as PDF:', error);
    }
  }, [calendarRef, fileName, paperSize]);

  return (
    <button 
      onClick={exportAsPDF} 
      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
      aria-label="Export calendar as PDF"
    >
      Export as PDF
    </button>
  );
};
