'use strict';

// $length[text]
module.exports = async (context, args) => {
  return String((args[0] || '').length);
};
