'use strict';

// $button[label;customID;style?]
//
// Adds a button to the message's component row.
// Styles: primary (default), secondary, success, danger, link
//
// Buttons are collected into ActionRows by Runtime._buildComponents().
// Up to 5 buttons per row; rows are created automatically.
//
// For link-style buttons, customID is used as the URL.
//
// Example:
//   $button[Click me!;click_btn;primary]
//   $button[Visit;https://discord.com;link]
module.exports = async (context, args) => {
  const label    = String(args[0] || 'Button');
  const customId = String(args[1] || 'button');
  const style    = String(args[2] || 'primary').toLowerCase();

  context.components.push({ type: 'button', label, customId, style });
  return '';
};
