import {type ClassValue, clsx } from 'clsx';
import {twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Array of class names or class value objects
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a localized string representation
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatDate');
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats a time into a localized string representation
 * @param date - Date object to format
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided to formatTime');
  }
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Checks if a date object is valid
 * @param date - Date object to validate
 * @returns boolean indicating if the date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Converts a relative path to an absolute URL using the app's base URL
 * @param path - Relative path to convert
 * @returns Absolute URL string
 */
export function absoluteUrl(path: string): string {
  // Return just the path in client-side context
  if (typeof window !== 'undefined') return path;

  // Get base URL from environment or use default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Combine base URL with path
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Creates a URL with query parameters
 * @param base - Base URL
 * @param params - Object of query parameters
 * @returns URL string with query parameters
 */
export function createUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(absoluteUrl(base));
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

// Utility function to generate a unique username
export async function generateUsername(name: string): Promise<string> {
  // Convert name to lowercase and remove special characters
  const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Add random numbers to make it unique
  const randomSuffix = Math.floor(Math.random() * 1000);

  return `${baseUsername}${randomSuffix}`;
}
