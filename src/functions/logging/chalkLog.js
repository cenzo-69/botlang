'use strict';
// $chalkLog[text;styles]  — logs styled text (bold, red, green, blue, yellow, cyan, magenta, white)
module.exports = async (context, args) => {
  const text   = String(args[0] !== undefined ? args[0] : '');
  const styles = String(args[1] !== undefined ? args[1] : '').split(',').map(s => s.trim().toLowerCase());
  const codes = {
    bold: '\x1b[1m', italic: '\x1b[3m', underline: '\x1b[4m',
    red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
    blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
    white: '\x1b[37m', gray: '\x1b[90m', reset: '\x1b[0m',
  };
  const applied = styles.map(s => codes[s] || '').join('');
  console.log(applied + text + '\x1b[0m');
  return '';
};
