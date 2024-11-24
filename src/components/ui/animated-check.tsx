// File: src/components/ui/password-strength.tsx
'use client';

import {useEffect, useState } from 'react';
import {motion } from 'framer-motion';

interface PasswordStrengthProps {
  password: string;
}

const strengthLevels = [
  { label: 'Very Weak', color: '#ef4444', width: '20%' },
  { label: 'Weak', color: '#f97316', width: '40%' },
  { label: 'Medium', color: '#eab308', width: '60%' },
  { label: 'Strong', color: '#22c55e', width: '80%' },
  { label: 'Very Strong', color: '#15803d', width: '100%' },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Common patterns check
    if (!/123|abc|password|qwerty/i.test(password)) score++;

    // Normalize score to 0-4 range
    setStrength(Math.min(4, Math.floor(score / 2)));
  }, [password]);

  const currentLevel = strengthLevels[strength];

  return (
    <div className="space-y-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: currentLevel.width,
            backgroundColor: currentLevel.color,
          }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm"
        style={{ color: currentLevel.color }}
      >
        Password Strength: {currentLevel.label}
      </motion.p>
    </div>
  );
}
