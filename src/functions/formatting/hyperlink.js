'use strict';
// $hyperlink[text;url]  — creates a [text](url) markdown hyperlink
module.exports = async (context, args) => {
  const text = String(args[0] !== undefined ? args[0] : '');
  const url  = String(args[1] !== undefined ? args[1] : '');
  if (!url) return '[error: $hyperlink — url is required. Usage: $hyperlink[text;https://example.com]]';
  return `[${text}](${url})`;
};
