'use strict';
// $editField[fieldIndex;name?;value?;inline?;embedIndex?]  — edits an existing embed field
module.exports = async (context, args) => {
  const fieldIdx = parseInt(args[0]);
  const name     = args[1] !== undefined ? String(args[1]) : undefined;
  const value    = args[2] !== undefined ? String(args[2]) : undefined;
  const inline   = args[3] === 'true';
  const embedIdx = parseInt(args[4] !== undefined ? args[4] : 0) || 0;
  if (isNaN(fieldIdx)) return '[error: FieldIndex must be a valid integer!]';
  const embeds = context.variables.get('__embeds__');
  if (!embeds) return '[error: No embeds are being built!]';
  try {
    const arr   = JSON.parse(embeds);
    const embed = arr[embedIdx];
    if (!embed?.fields?.[fieldIdx]) return '[error: Field not found at given index!]';
    if (name  !== undefined) embed.fields[fieldIdx].name   = name;
    if (value !== undefined) embed.fields[fieldIdx].value  = value;
    embed.fields[fieldIdx].inline = inline;
    context.variables.set('__embeds__', JSON.stringify(arr));
    return '';
  } catch (err) { return `[error: ${err.message}!]`; }
};
