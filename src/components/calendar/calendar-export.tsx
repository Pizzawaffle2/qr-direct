// src/components/calendar/calendar-export.tsx

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CalendarExportProps {
  calendarRef: React.RefObject<HTMLDivElement>;
}

export const CalendarExport = ({ calendarRef }: CalendarExportProps) => {
  const exportAsPDF = async () => {
    if (!calendarRef.current) return;
    const canvas = await html2canvas(calendarRef.current);
    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imageData, "PNG", 0, 0, 210, 297); // A4 dimensions in mm
    pdf.save("calendar.pdf");
  };

  return (
    <button onClick={exportAsPDF} className="bg-blue-500 text-white p-2 rounded">
      Export as PDF
    </button>
  );
};
