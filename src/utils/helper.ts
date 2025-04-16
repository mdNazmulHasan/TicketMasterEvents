export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString?: string): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
    hour >= 12 ? 'PM' : 'AM'
  }`;
};
