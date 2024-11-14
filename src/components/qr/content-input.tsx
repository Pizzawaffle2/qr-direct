// src/components/qr/content-input.tsx
import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { z } from 'zod';

// Define input validation schema
const contentSchema = z.string().min(1, 'Content is required');

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
  maxLength?: number;
  className?: string;
}

interface ValidationState {
  isValid: boolean;
  error?: string;
}

export function ContentInput({
  value,
  onChange,
  placeholder = "Enter URL or text",
  label = "QR Code Content",
  debounceMs = 300,
  maxLength = 2048,
  className = "",
}: ContentInputProps) {
  // Validation state
  const [validation, setValidation] = useState<ValidationState>({ isValid: true });

  // Validate input
  const validateInput = (input: string): ValidationState => {
    try {
      contentSchema.parse(input);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0].message,
        };
      }
      return {
        isValid: false,
        error: 'Invalid input',
      };
    }
  };

  // Debounced change handler
  const debouncedOnChange = useCallback(
    debounce(async (value: string) => {
      const validationResult = validateInput(value);
      setValidation(validationResult);
      if (validationResult.isValid) {
        onChange(value);
      }
    }, debounceMs),
    [onChange, debounceMs]
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      debouncedOnChange(newValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <Label 
          htmlFor="qr-content"
          className="text-sm font-medium"
        >
          {label}
        </Label>
        <span className="text-xs text-gray-500">
          {value.length}/{maxLength}
        </span>
        
      </div>

      <div className="relative">
        <Input
          id="qr-content"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full ${!validation.isValid ? 'border-red-500' : ''}`}
          aria-invalid={!validation.isValid}
          aria-describedby={!validation.isValid ? 'error-message' : undefined}
        />
        
        {!validation.isValid && validation.error && (
          <p 
            id="error-message"
            className="text-xs text-red-500 mt-1"
            role="alert"
          >
            {validation.error}
          </p>
        )}
      </div>
    </div>
  );
}

// Optional: Export a memoized version for better performance
export const MemoizedContentInput = React.memo(ContentInput);
