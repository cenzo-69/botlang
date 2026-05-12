'use strict';
// $parseDate[ms;type]  — parses ms timestamp to date component
// type: year|month|day|hour|minute|second|weekday|iso|locale|date|time
module.exports = async (context, args) => {
  const ms   = parseInt(args[0] !== undefined ? args[0] : Date.now());
  const type = String(args[1] !== undefined ? args[1] : 'iso').toLowerCase();
  if (isNaN(ms)) return '[error: $parseDate — first argument must be a valid timestamp in milliseconds]';
  const d = new Date(ms);
  const pad = n => String(n).padStart(2, '0');
  switch (type) {
    case 'year':    return String(d.getFullYear());
    case 'month':   return String(d.getMonth() + 1);
    case 'day':     return String(d.getDate());
    case 'hour':    return String(d.getHours());
    case 'minute':  return String(d.getMinutes());
    case 'second':  return String(d.getSeconds());
    case 'weekday': return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
    case 'iso':     return d.toISOString();
    case 'locale':  return d.toLocaleString();
    case 'date':    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    case 'time':    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    default:        return d.toISOString();
  }
};
