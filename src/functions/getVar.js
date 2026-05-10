'use strict';

// $getVar[name]            — get a session variable
// $getVar[name;default]    — with fallback default
module.exports = async (context, args) => {
  const name = args[0];
  if (!name) return '';

  const value = context.getVariable(name);
  if (value === undefined || value === null) {
    return args[1] !== undefined ? String(args[1]) : '';
  }
  return String(value);
};
