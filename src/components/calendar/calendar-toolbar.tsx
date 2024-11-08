// src/components/calendar/calendar-toolbar.tsx

import React from "react";

interface CalendarToolbarProps {
  onThemeChange: (theme: string) => void;
  onFrameChange: (frame: string) => void;
  onFontChange: (font: string) => void;
}

export const CalendarToolbar = ({ onThemeChange, onFrameChange, onFontChange }: CalendarToolbarProps) => {
  return (
    <div className="flex space-x-4 p-4 border-b">
      <div>
        <label>Theme</label>
        <select onChange={(e) => onThemeChange(e.target.value)} className="border rounded p-1">
          <option value="default">Default</option>
          <option value="holiday">Holiday</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
      <div>
        <label>Frame</label>
        <select onChange={(e) => onFrameChange(e.target.value)} className="border rounded p-1">
          <option value="none">None</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
        </select>
      </div>
      <div>
        <label>Font</label>
        <select onChange={(e) => onFontChange(e.target.value)} className="border rounded p-1">
          <option value="arial">Arial</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>
    </div>
  );
};
