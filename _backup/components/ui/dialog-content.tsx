// src/components/ui/dialog-content.tsx

import React from 'react';

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="dialog-content rounded-lg bg-gray-800 bg-opacity-90 p-6 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-gray-700">
    {children}
  </div>
);

export default DialogContent;
