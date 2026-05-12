'use strict';

const evaluateCondition = require('../../core/evaluateCondition');

// $checkCondition[condition]
// Evaluates a condition (same syntax as $if) and returns "true" or "false".
module.exports = async (context, args) => {
  const condition = String(args[0] !== undefined ? args[0] : '').trim();
  if (!condition) return 'false';
  try {
    return String(evaluateCondition(condition));
  } catch {
    return 'false';
  }
};
