const { DateTime } = require('luxon');

const parseDay = (value) => {
  const day = String(value);
  return DateTime.fromFormat(day, 'yyyy-MM-dd', { zone: 'utc' });
};

const parseDateRange = (start, end) => {
  if (!start || !end) {
    return { error: 'Pick up and return dates are required' };
  }

  const startDate = parseDay(start);
  const endDate = parseDay(end);
  if (!startDate.isValid || !endDate.isValid) {
    return { error: 'Please enter a valid date range' };
  }
  if (endDate < startDate) {
    return { error: 'Return date must be on or after the pick up date' };
  }

  return { startDate: startDate.toJSDate(), endDate: endDate.toJSDate() };
};

module.exports = { parseDateRange };
