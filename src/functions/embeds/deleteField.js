'use strict';
// $deleteField[fieldIndex;embedIndex?]  — removes a field at given index from embed
// Uses context.__embeds__ to track the embed builders
module.exports = async (context, args) => {
  const fieldIdx = parseInt(args[0]);
  const embedIdx = parseInt(args[1] !== undefined ? args[1] : 0) || 0;
  if (isNaN(fieldIdx)) return '[error: FieldIndex must be a valid integer!]';
  const embeds = context.variables.get('__embeds__');
  if (!embeds) return '[error: No embeds are being built!]';
  try {
    const arr = JSON.parse(embeds);
    const embed = arr[embedIdx];
    if (!embed) return '[error: Embed at specified index does not exist!]';
    if (!embed.fields) return '';
    embed.fields.splice(fieldIdx, 1);
    context.variables.set('__embeds__', JSON.stringify(arr));
    return '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
