import { DateTime } from 'luxon';

export const parseDay = (dateStr) => {
  const day = String(dateStr);
  return DateTime.fromFormat(day, 'yyyy-MM-dd', { zone: 'utc' });
};

export const dateRangeDays = (startDateStr, endDateStr) => {
  const startDate = parseDay(startDateStr);
  const endDate = parseDay(endDateStr);
  if (!startDate.isValid || !endDate.isValid || endDate < startDate) return 1;

  const days = endDate.diff(startDate, 'days').days;
  return days > 0 ? days : 1;
};

export const formatDay = (dateStr) => {
  const date = parseDay(dateStr);
  if (!date.isValid) return dateStr;

  return date.toFormat('ccc d LLL yyyy');
};
