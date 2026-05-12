'use strict';
// $checkCondition[condition]  — evaluates a condition expression (==, !=, >, <, >=, <=)
// Example: $checkCondition[$memberCount[]==100]
module.exports = async (context, args) => {
  const cond = String(args[0] !== undefined ? args[0] : '').trim();
  if (!cond) return 'false';
  // Try numeric/string comparison operators
  const ops = ['>=', '<=', '!=', '==', '>', '<'];
  for (const op of ops) {
    const idx = cond.indexOf(op);
    if (idx === -1) continue;
    const left  = cond.slice(0, idx).trim();
    const right = cond.slice(idx + op.length).trim();
    const lNum  = parseFloat(left);
    const rNum  = parseFloat(right);
    const numericOk = !isNaN(lNum) && !isNaN(rNum);
    switch (op) {
      case '==': return String(numericOk ? lNum === rNum : left === right);
      case '!=': return String(numericOk ? lNum !== rNum : left !== right);
      case '>':  return String(numericOk && lNum > rNum);
      case '<':  return String(numericOk && lNum < rNum);
      case '>=': return String(numericOk && lNum >= rNum);
      case '<=': return String(numericOk && lNum <= rNum);
    }
  }
  // Boolean check
  const lower = cond.toLowerCase();
  return String(lower !== 'false' && lower !== '0' && lower !== '');
};
