import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="progress-bar-container">
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          textColor: '#0070ca',
          pathColor: '#0070ca',
          trailColor: '#ececec',
        })}
      />
    </div>
  );
}
