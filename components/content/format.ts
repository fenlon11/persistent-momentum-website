// Dates are calendar days (YYYY-MM-DD); format in UTC so no timezone shifts them by a day.
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const typeLabel = { news: 'News', guide: 'Guide' } as const;
