'use strict';

/**
 * CenzoJS error helpers.
 *
 * Both functions return a plain [error: message] string.
 * The Interpreter intercepts these and formats them as:
 *
 *   ❌ Function `$funcName` at `line:col` returned an error: message
 *
 * fnError(funcName, reason)
 *   General-purpose error — use for logic failures, missing resources, etc.
 *
 * argError(context, argName, expectedType, gotValue)
 *   Argument validation error — use when an argument is missing or wrong type.
 */

function fnError(funcName, reason) {
  return `[error: ${reason}]`;
}

function argError(context, argName, expectedType, gotValue) {
  const isEmpty =
    gotValue === undefined ||
    gotValue === null      ||
    gotValue === ''        ||
    gotValue !== gotValue; // NaN check

  if (isEmpty) {
    if (expectedType === 'number')    return `[error: \`${argName}\` must be a valid number!]`;
    if (expectedType === 'Snowflake') return `[error: \`${argName}\` must be a valid Discord ID!]`;
    return `[error: \`${argName}\` is required!]`;
  }

  const val = String(gotValue).slice(0, 80);
  if (expectedType === 'number')    return `[error: \`${argName}\` must be a valid number, got \`${val}\`!]`;
  if (expectedType === 'Snowflake') return `[error: \`${argName}\` must be a valid Discord ID, got \`${val}\`!]`;
  return `[error: \`${argName}\` must be of type \`${expectedType}\`, got \`${val}\`!]`;
}

module.exports = fnError;
module.exports.argError = argError;
