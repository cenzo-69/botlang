'use strict';

// $or[cond1;cond2;...condN]  → true | false
// At least one condition must be truthy
module.exports = async (context, args) => {
  for (const arg of args) {
    const v = String(arg).trim().toLowerCase();
    if (v !== '' && v !== '0' && v !== 'false') return 'true';
  }
  return 'false';
};
