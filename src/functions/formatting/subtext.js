'use strict';
// $subtext[text]  — creates a Discord subtext with -# prefix
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  return `-# ${text}`;
};
