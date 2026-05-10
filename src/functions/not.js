'use strict';

// $not[value]  → true | false
module.exports = async (context, args) => {
  const v = String(args[0] || '').trim().toLowerCase();
  const falsy = v === '' || v === '0' || v === 'false';
  return String(falsy);
};
