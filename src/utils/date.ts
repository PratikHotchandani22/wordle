const MS_PER_DAY = 1000 * 60 * 60 * 24;

const atLocalStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const daysBetween = (start: Date, end: Date) => {
  const startDay = atLocalStartOfDay(start).getTime();
  const endDay = atLocalStartOfDay(end).getTime();
  return Math.floor((endDay - startDay) / MS_PER_DAY);
};

export const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const toISODate = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};
