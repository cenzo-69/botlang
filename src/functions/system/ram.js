'use strict';
const os = require('os');
// $ram  — returns current RAM usage in MB
module.exports = async () => {
  const used = os.totalmem() - os.freemem();
  return String(parseFloat((used / 1024 / 1024).toFixed(2)));
};
