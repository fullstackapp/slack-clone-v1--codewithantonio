import { type ClassValue, clsx } from 'clsx';
import { format, isToday, isYesterday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createInitials(name?: string): string {
  if (!name?.trim()) return '';
  const words = name.trim().split(/\s+/);

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
  ).join('');
  return code;
};

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'EEEE, MMMM d');
};

export const formatFullTime = (date: Date) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return `${format(date, 'EEEE, MMMM d')} at ${format(date, 'h:mm a')}`;
};
