'use strict';

// $randomText[option1;option2;option3;...]
// Returns one of the provided options at random.
module.exports = async (context, args) => {
  if (!args.length) return '';
  return args[Math.floor(Math.random() * args.length)];
};
