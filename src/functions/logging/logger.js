'use strict';
// $logger[type;text]  — logs with a specific level: info|warn|error|debug
module.exports = async (context, args) => {
  const type = String(args[0] !== undefined ? args[0] : 'info').toLowerCase();
  const text = String(args[1] !== undefined ? args[1] : '');
  const prefix = `[CenzoLog:${type.toUpperCase()}]`;
  switch (type) {
    case 'warn':  console.warn(prefix, text); break;
    case 'error': console.error(prefix, text); break;
    case 'debug': console.debug(prefix, text); break;
    default:      console.log(prefix, text);
  }
  return '';
};
