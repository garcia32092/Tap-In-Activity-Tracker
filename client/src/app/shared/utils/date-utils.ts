// shared/utils/date-utils.ts
import { format, parseISO, isValid } from 'date-fns';

/**
 * Converts a JavaScript Date object to a string formatted for the database.
 * - Converts to 'YYYY-MM-DD' for date fields.
 * - Converts to 'HH:mm:ss' for time fields.
 */
export function formatDateForDatabase(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatTimeForDatabase(date: Date): string {
  return format(date, 'HH:mm:ss');
}

/**
 * Parses a string from the database (in ISO format) into a JavaScript Date object.
 * Returns null if the input is invalid.
 */
export function parseDateFromDatabase(dateString: string): Date | null {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) ? parsedDate : null;
}

/**
 * Formats a date for use in form inputs (e.g., 'datetime-local' format).
 * Converts a Date object to 'YYYY-MM-DDTHH:mm' format.
 */
export function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Parses a date from an input (e.g., 'datetime-local') back into a Date object.
 */
export function parseDateFromInput(dateString: string): Date | null {
  const parsedDate = new Date(dateString);
  return isValid(parsedDate) ? parsedDate : null;
}

/**
 * Utility to format Date objects to readable strings (e.g., 'MMM dd, yyyy HH:mm').
 * Modify as needed for specific formats.
 */
export function formatDateReadable(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm');
}

/**
 * Combines a Date object with a time string (HH:mm:ss) into a single Date object.
 * @param date - The base Date object.
 * @param time - A string representing the time in 'HH:mm:ss' format.
 * @returns A new Date object with the combined date and time.
 */
export function combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, seconds || 0);
    return combinedDate;
  }