'use strict';

// $randomString[length;chars?]
// Generate a random string of the given length.
// chars: character pool (default: alphanumeric)
module.exports = async (context, args) => {
  const len   = parseInt(args[0]) || 8;
  const chars = args[1] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result  = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
