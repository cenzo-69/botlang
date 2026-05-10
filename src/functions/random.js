'use strict';

// $random[min;max]   → random integer between min and max (inclusive)
// $random[max]       → random integer between 1 and max (inclusive)
module.exports = async (context, args) => {
  let min, max;

  if (args.length >= 2) {
    min = parseInt(args[0]);
    max = parseInt(args[1]);
  } else {
    min = 1;
    max = parseInt(args[0]);
  }

  if (isNaN(min) || isNaN(max) || max < min) return '[random error]';

  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
