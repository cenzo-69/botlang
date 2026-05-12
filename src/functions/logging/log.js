'use strict';
// $log[message]  — logs a message to the console (stdout)
module.exports = async (context, args) => {
  const message = String(args[0] !== undefined ? args[0] : '');
  console.log(`[CenzoLog] ${message}`);
  return '';
};
