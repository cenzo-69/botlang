'use strict';
// $selectMenuValues[index?;separator?]  — returns selected values from a select menu
module.exports = async (context, args) => {
  const index = args[0] !== undefined ? parseInt(args[0]) : undefined;
  const sep   = String(args[1] !== undefined ? args[1] : ', ');
  const vals  = context.interaction?.values ?? [];
  if (!vals.length) return '';
  if (!isNaN(index) && index !== undefined) return String(vals[index] ?? '');
  return vals.join(sep);
};
