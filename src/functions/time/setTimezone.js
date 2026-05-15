'use strict';
// $setTimezone[timezone]  — stores timezone for use by time functions (stored in context)
module.exports = async (context, args) => {
  const tz = String(args[0] !== undefined ? args[0] : '').trim();
  if (!tz) return '[error: Timezone is required. Example: America/New_York, UTC, Europe/London!]';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
  } catch {
    return `[error: Invalid timezone: "${tz}"!]`;
  }
  context.variables.set('__timezone__', tz);
  return '';
};
