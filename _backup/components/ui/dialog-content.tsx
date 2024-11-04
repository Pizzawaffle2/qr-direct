// src/components/ui/dialog-content.tsx

import React from 'react';

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="dialog-content backdrop-blur-md bg-opacity-90 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg p-6 transition-all duration-300">
    {children}
  </div>
);

export default DialogContent;
