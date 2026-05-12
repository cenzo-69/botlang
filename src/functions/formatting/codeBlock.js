'use strict';
// $codeBlock[text;lang?]  — wraps text in a fenced code block
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const lang = args[1] !== undefined ? String(args[1]).trim() : '';
  return `\`\`\`${lang}\n${text}\n\`\`\``;
};
