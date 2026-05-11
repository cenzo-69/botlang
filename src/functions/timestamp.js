'use strict';

// $timestamp  — add current timestamp to the embed footer
module.exports = async (context, args) => {
  context.embed.timestamp = Date.now();
  return '';
};
