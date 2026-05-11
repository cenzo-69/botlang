'use strict';

// $addField[name;value;inline?]  — push a field onto the embed
// inline defaults to false; pass "true" to make it inline
module.exports = async (context, args) => {
  const name   = args[0] || '\u200b';  // zero-width space keeps Discord happy
  const value  = args[1] || '\u200b';
  const inline = args[2] === 'true';

  context.embed.fields.push({ name, value, inline });
  return '';
};
