'use strict';
// $default[leftHand;rightHand]  — returns rightHand if leftHand is falsy/empty
module.exports = async (context, args) => {
  const left  = args[0] !== undefined ? String(args[0]) : '';
  const right = args[1] !== undefined ? String(args[1]) : '';
  return (!left || left === 'false' || left === '0') ? right : left;
};
