import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInfo() {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  return null; // Return a default value when `localStorage` is not available
}
