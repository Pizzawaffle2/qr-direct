"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { CalendarTheme } from "@/types/calendar-themes";
import { Download, Printer, FileType, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportOptions {
  filename: string;
  format: 'pdf' | 'png';
  quality: 'high' | 'medium' | 'draft';
  includeCover: boolean;
  optimizeForPrinting: boolean;
  paperSize: 'a4' | 'letter' | 'a3';
  orientation: 'portrait' | 'landscape';
}

interface CalendarExportProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  theme: CalendarTheme;
  title: string;
}

export function CalendarExport({ calendarRef, theme, title }: CalendarExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [options, setOptions] = useState<ExportOptions>({
    filename: title || 'calendar',
    format: 'pdf',
    quality: 'high',
    includeCover: true,
    optimizeForPrinting: true,
    paperSize: 'a4',
    orientation: 'portrait'
  });

  const paperSizes = {
    a4: { width: 210, height: 297 },
    letter: { width: 216, height: 279 },
    a3: { width: 297, height: 420 }
  };

  const exportCalendar = async () => {
    if (!calendarRef.current) return;
    setIsExporting(true);
    setProgress(0);

    try {
      // Apply print optimization styles
      const printStyles = document.createElement('style');
      printStyles.innerHTML = `
        @media print {
          .calendar-export {
            background-color: ${theme.printStyles?.background ? theme.colors.background : 'white'} !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .calendar-frame {
            opacity: ${theme.printStyles?.frameOpacity || 1};
          }
          
          @page {
            size: ${options.paperSize} ${options.orientation};
            margin: 0;
          }
        }
      `;
      document.head.appendChild(printStyles);

      setProgress(20);

      // Generate high-quality image
      const canvas = await html2canvas(calendarRef.current, {
        scale: options.quality === 'high' ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: theme.colors.background,
      });

      setProgress(60);

      if (options.format === 'png') {
        // Export as PNG
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${options.filename}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // Export as PDF
        const { width, height } = paperSizes[options.paperSize];
        const pdf = new jsPDF({
          orientation: options.orientation,
          unit: 'mm',
          format: options.paperSize
        });

        // Add cover page if selected
        if (options.includeCover) {
          pdf.setFillColor(theme.colors.background);
          pdf.rect(0, 0, width, height, 'F');
          
          // Add title
          pdf.setTextColor(theme.colors.text);
          pdf.setFontSize(24);
          pdf.text(title, width / 2, height / 4, { align: 'center' });
          
          pdf.addPage();
        }

        // Add calendar pages
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height, '', 'FAST');

        // Save PDF
        pdf.save(`${options.filename}.pdf`);
      }

      setProgress(100);
      toast({
        title: "Export complete",
        description: `Calendar exported as ${options.format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your calendar.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const handlePrint = () => {
    if (!calendarRef.current) return;
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            value={options.filename}
            onChange={(e) => setOptions(prev => ({ ...prev, filename: e.target.value }))}
            placeholder="Enter filename"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Format</Label>
          <div className="flex gap-2">
            <Button
              variant={options.format === 'pdf' ? "default" : "outline"}
              onClick={() => setOptions(prev => ({ ...prev, format: 'pdf' }))}
              className="flex-1"
            >
              PDF
            </Button>
            <Button
              variant={options.format === 'png' ? "default" : "outline"}
              onClick={() => setOptions(prev => ({ ...prev, format: 'png' }))}
              className="flex-1"
            >
              PNG
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Optimize for Printing</Label>
            <p className="text-sm text-muted-foreground">
              Adjust colors and patterns for better print quality
            </p>
          </div>
          <Switch
            checked={options.optimizeForPrinting}
            onCheckedChange={(checked) => 
              setOptions(prev => ({ ...prev, optimizeForPrinting: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Include Cover Page</Label>
            <p className="text-sm text-muted-foreground">
              Add a title page to the calendar
            </p>
          </div>
          <Switch
            checked={options.includeCover}
            onCheckedChange={(checked) => 
              setOptions(prev => ({ ...prev, includeCover: checked }))
            }
          />
        </div>
      </div>

      {isExporting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Exporting calendar...
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex-1"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={exportCalendar}
          disabled={isExporting}
          className="flex-1"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </div>
    </div>
  );
}