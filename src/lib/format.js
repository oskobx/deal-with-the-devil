export function money(value) {
  const v = Number(value) || 0;
  const isWhole = Math.abs(v - Math.round(v)) < 0.005;
  return `$${isWhole ? Math.round(v) : v.toFixed(2)}`;
}

export function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  }).format(d);
}

export const HABIT_OPTIONS = [
  { id: 'food_delivery', label: 'Food delivery' },
  { id: 'fast_food', label: 'Fast food' },
  { id: 'impulse_shopping', label: 'Impulse shopping' },
  { id: 'rideshare', label: 'Rideshare' },
  { id: 'nights_out', label: 'Nights out' },
  { id: 'custom', label: 'Something else' }
];