/**
 * Formats a date string into a localized long-format date
 * @param dateString - ISO date string (e.g., "2025-05-12")
 * @returns Formatted date (e.g., "May 12, 2025")
 */
export const formatDate = (dateString: string): string => {
  // Set formatting options for human-readable date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', // Show full year (e.g., 2025)
    month: 'long', // Show full month name (e.g., May)
    day: 'numeric', // Show day of month (e.g., 12)
  };
  // Convert to local date string based on user's locale
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Formats a time string into 12-hour format with AM/PM
 * @param timeString - Optional time string in 24-hour format (e.g., "19:30:00")
 * @returns Formatted time in 12-hour format (e.g., "7:30 PM") or empty string if no time provided
 */
export const formatTime = (timeString?: string): string => {
  // Return empty string if no time provided
  if (!timeString) return '';

  // Split hours and minutes from time string
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);

  // Convert to 12-hour format with AM/PM indicator
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
    hour >= 12 ? 'PM' : 'AM'
  }`;
};
