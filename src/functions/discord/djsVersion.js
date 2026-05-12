'use strict';
// $djsVersion  — returns the discord.js package version
module.exports = async () => {
  try {
    return require('discord.js').version;
  } catch { return 'unknown'; }
};
