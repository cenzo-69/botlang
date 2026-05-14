'use strict';

/**
 * CenzoJS unified error formatter.
 *
 * Two modes:
 *
 * 1. fnError(funcName, reason, details?)
 *    General function error — shows reason + optional Got/Expected/Example/Tip block.
 *
 *    ⛔ `$funcName` — reason
 *    ┌─────────────────────────────────
 *    │ Got      › value
 *    │ Expected › format
 *    │ Example  › $func[usage]
 *    └─────────────────────────────────
 *
 * 2. argError(context, argName, expectedType, gotValue)
 *    Argument type/value error — matches the detailed Discord error style.
 *
 *    Given value `<got>` for argument `<argName>` is not of type `<expectedType>`
 *    at `$funcName[raw source args]`
 *
 * The `context` passed to argError must be the child context received by the
 * executing function — it carries `callSiteRaw` set by the Interpreter.
 */

// ── General function error ─────────────────────────────────────────────────

function fnError(funcName, reason, details = {}) {
  const name = funcName.startsWith('$') ? funcName : `$${funcName}`;

  const lines = [];
  if (details.got      !== undefined) lines.push(`│ **Got**      › \`${String(details.got).slice(0, 80)}\``);
  if (details.expected !== undefined) lines.push(`│ **Expected** › ${details.expected}`);
  if (details.example  !== undefined) lines.push(`│ **Example**  › \`${details.example}\``);
  if (details.tip      !== undefined) lines.push(`│ **Tip**      › ${details.tip}`);

  const header = `⛔ \`${name}\` — ${reason}`;

  if (!lines.length) return header;

  return [
    header,
    '┌─────────────────────────────────',
    ...lines,
    '└─────────────────────────────────',
  ].join('\n');
}

// ── Argument type/value error ──────────────────────────────────────────────

/**
 * Produces a detailed argument error in the style shown in error messages:
 *
 *   Given value `<got>` for argument `<argName>` is not of type `<expectedType>`
 *   at `$funcName[raw source]`
 *
 * @param {object} context       — child context received by the function
 * @param {string} argName       — human-readable argument name (e.g. "userID")
 * @param {string} expectedType  — expected type label (e.g. "Snowflake", "string", "number")
 * @param {*}      gotValue      — the value that was actually received
 * @returns {string}
 */
function argError(context, argName, expectedType, gotValue) {
  const callSite = context.callSiteRaw || `$${context.functionName || '?'}`;

  // Format the received value: show empty string clearly, truncate long values
  let valDisplay;
  if (gotValue === undefined || gotValue === null || gotValue === '') {
    valDisplay = '';
  } else {
    valDisplay = String(gotValue).slice(0, 80);
  }

  return [
    `Given value \`${valDisplay}\` for argument \`${argName}\` is not of type \`${expectedType}\``,
    `at \`${callSite}\``,
  ].join('\n');
}

module.exports = fnError;
module.exports.argError = argError;
