import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInfo() {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('user') || "{name: 'ERROR'}");
  }
  return null; // Return a default value when `localStorage` is not available
}
export function checkEnvironment() {
  let base_url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://queue-school.vercel.app'; // https://v2ds.netlify.app

  return base_url;
}

export function generateRandomOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // digits 0-9
  }
  return otp;
}
