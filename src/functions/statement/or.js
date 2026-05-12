'use strict';
// $or[condition1;condition2;...]  — returns "true" if ANY condition is truthy
module.exports = async (context, args) => {
  return String(args.some(a => {
    const s = String(a).trim().toLowerCase();
    return s !== '' && s !== 'false' && s !== '0';
  }));
};
