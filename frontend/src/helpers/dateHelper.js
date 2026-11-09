import { DateTime } from 'luxon';

export const parseDay = (dateStr) => {
  const value = String(dateStr);
  const day = DateTime.fromFormat(value, 'yyyy-MM-dd', { zone: 'utc' });
  if (day.isValid) return day;

  return DateTime.fromISO(value, { zone: 'utc' }).startOf('day');
};

export const dateRangeDays = (startDateStr, endDateStr) => {
  const startDate = parseDay(startDateStr);
  const endDate = parseDay(endDateStr);
  if (!startDate.isValid || !endDate.isValid || endDate < startDate) return 1;

  const days = endDate.diff(startDate, 'days').days;
  return days > 0 ? days : 1;
};

export const formatDay = (dateStr, format = 'ccc d LLL yyyy') => {
  const date = parseDay(dateStr);
  if (!date.isValid) return dateStr;

  return date.toFormat(format);
};
