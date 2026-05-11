'use strict';

module.exports = async (context) => {
  if (!context.message) return '[no message]';
  return context.message.channel.id;
};
