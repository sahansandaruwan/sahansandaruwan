export function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Recent';
    }
    return date.toLocaleDateString('en-US', options);
  } catch {
    return 'Recent';
  }
}

export function getYear(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().getFullYear().toString();
    }
    return date.getFullYear().toString();
  } catch {
    return new Date().getFullYear().toString();
  }
}
