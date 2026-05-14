'use strict';

const { argError } = require('../../core/fnError');
// $option[name;type?]  — gets a slash command option value
// type: string (default)|integer|boolean|user|channel|role|number
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  const type = String(args[1] !== undefined ? args[1] : 'string').toLowerCase();
  if (!name) return argError(context, 'name', 'string', name);
  const i = context.interaction;
  if (!i?.options) return '';
  try {
    switch (type) {
      case 'integer':  return String(i.options.getInteger(name) ?? '');
      case 'boolean':  return String(i.options.getBoolean(name) ?? '');
      case 'user':     return i.options.getUser(name)?.id ?? '';
      case 'channel':  return i.options.getChannel(name)?.id ?? '';
      case 'role':     return i.options.getRole(name)?.id ?? '';
      case 'number':   return String(i.options.getNumber(name) ?? '');
      default:         return String(i.options.getString(name) ?? '');
    }
  } catch { return ''; }
};
