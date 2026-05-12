'use strict';
// $input[customID?]  — returns value from a modal text input field
module.exports = async (context, args) => {
  const id = args[0] !== undefined ? String(args[0]).trim() : '';
  const interaction = context.interaction;
  if (!interaction?.fields) return '';
  try {
    return id ? (interaction.fields.getTextInputValue(id) ?? '') : '';
  } catch { return ''; }
};
