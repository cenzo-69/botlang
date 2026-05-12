'use strict';

/**
 * Centralized CenzoJS function error formatter.
 *
 * Produces a rich Discord-markdown error message:
 *
 *   ⛔ `$funcName` — reason
 *   ┌─────────────────────────
 *   │ Got      : value
 *   │ Expected : format
 *   │ Example  : $func[30s]
 *   └─────────────────────────
 *
 * @param {string} funcName   — e.g. "parseTime"
 * @param {string} reason     — human-readable description
 * @param {object} [details]
 *   @param {*}      [details.got]      — what was actually received
 *   @param {string} [details.expected] — expected type / format
 *   @param {string} [details.example]  — usage example
 *   @param {string} [details.tip]      — optional extra hint
 */
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

module.exports = fnError;
