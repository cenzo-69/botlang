'use strict';
const os = require('os');
// $networkCardNames[separator]  — returns network interface names
module.exports = async (context, args) => {
  const sep = String(args[0] !== undefined ? args[0] : ', ');
  return Object.keys(os.networkInterfaces()).join(sep) || 'none';
};
