'use strict';

// $and[cond1;cond2;...condN]  → true | false
// All conditions must be truthy
module.exports = async (context, args) => {
  for (const arg of args) {
    const v = String(arg).trim().toLowerCase();
    if (v === '' || v === '0' || v === 'false') return 'false';
  }
  return 'true';
};
