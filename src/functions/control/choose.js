'use strict';

// $choose[option1;option2;option3;...]
// Alias for $randomText — returns one option at random.
module.exports = async (context, args) => {
  if (!args.length) return '';
  return args[Math.floor(Math.random() * args.length)];
};
