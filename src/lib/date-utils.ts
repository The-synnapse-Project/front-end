/**
 * Format a date string to YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format a date string to DD/MM/YYYY format
 */
export function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get today's date as a string in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Parse a date string in format YYYY-MM-DD to a Date object
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Get a list of dates (YYYY-MM-DD strings) for the past n days
 */
export function getRecentDates(days: number = 7): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }

  return dates;
}
