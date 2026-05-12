'use strict';

/**
 * Parse a human-readable duration string into milliseconds.
 * Accepts:  30s | 5m | 2h | 1d | 500ms | 1.5h
 * Plain integers are treated as seconds.
 * Returns 0 for invalid input.
 */
function parseTime(str) {
  if (str === null || str === undefined) return 0;
  const s = String(str).trim();
  const m = s.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d)?$/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] || 's').toLowerCase();
  const units = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return Math.round(n * (units[unit] ?? 1000));
}

module.exports = parseTime;
