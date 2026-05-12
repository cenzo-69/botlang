'use strict';
// $and[condition1;condition2;...]  — returns "true" if ALL conditions are truthy
module.exports = async (context, args) => {
  return String(args.every(a => {
    const s = String(a).trim().toLowerCase();
    return s !== '' && s !== 'false' && s !== '0';
  }));
};
