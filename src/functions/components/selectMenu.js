'use strict';

// $selectMenu[customID;placeholder;label1;value1;label2;value2;...]
//
// Adds a string select menu to the message components.
// Options are provided as label/value pairs after the placeholder.
// Each row can contain only one select menu.
//
// Example:
//   $selectMenu[color_pick;Pick a color;Red;red;Green;green;Blue;blue]
module.exports = async (context, args) => {
  const customId    = String(args[0] || 'menu');
  const placeholder = String(args[1] || 'Select an option…');

  // Remaining args are label/value pairs
  const options = [];
  for (let i = 2; i < args.length - 1; i += 2) {
    const label = String(args[i]     || '');
    const value = String(args[i + 1] || label);
    if (label) options.push({ label, value });
  }

  context.components.push({ type: 'selectMenu', customId, placeholder, options });
  return '';
};
