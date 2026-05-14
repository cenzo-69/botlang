#!/usr/bin/env node
'use strict';

/**
 * CenzoJS error upgrade script.
 *
 * Transforms legacy [error: $funcName — message] returns in all function files
 * to rich argError() calls that produce:
 *
 *   Given value `<got>` for argument `<argName>` is not of type `<Type>`
 *   at `$funcName[raw source]`
 *
 * Safe transformations only — patterns that cannot be confidently mapped are
 * left unchanged (the Interpreter-level intercept still adds "at" context).
 *
 * Usage:  node scripts/upgrade-errors.js [--dry-run] [--dir src/functions]
 */

const fs   = require('fs');
const path = require('path');

// ── CLI flags ───────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const ROOT    = process.argv.find(a => a.startsWith('--dir='))?.slice(6)
             || path.join(__dirname, '..', 'src', 'functions');

// ── Type inference from arg/variable names ──────────────────────────────────
function inferType(varName) {
  const n = varName.toLowerCase();
  if (/userid|targetid|memberid|authorid|snowflake/.test(n)) return 'Snowflake';
  if (/\buser\b/.test(n))    return 'User';
  if (/\bmember\b/.test(n))  return 'Member';
  if (/channelid|channel/.test(n)) return 'TextChannel';
  if (/roleid|role/.test(n)) return 'Role';
  if (/guildid|serverid/.test(n)) return 'Snowflake';
  if (/messageid|msgid/.test(n)) return 'Snowflake';
  if (/\bwebhookid\b/.test(n)) return 'Snowflake';
  if (/threadid/.test(n))    return 'Snowflake';
  if (/emojiid|emoji/.test(n)) return 'Snowflake';
  if (/index|position|pos/.test(n)) return 'number';
  if (/count|limit|amount|num|number|size|length|duration|timeout|delay/.test(n)) return 'number';
  if (/\btime\b|\btimestamp\b/.test(n)) return 'Duration';
  if (/color|colour/.test(n)) return 'HexColor';
  if (/url|link/.test(n))    return 'URL';
  if (/json/.test(n))        return 'JSON';
  return 'string';
}

// Human-readable display name from camelCase/underscored variable names
function displayName(varName) {
  return varName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\bId\b/gi, ' ID')
    .trim()
    .toLowerCase();
}

// ── Collect all .js files recursively ──────────────────────────────────────
function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) results.push(full);
  }
  return results;
}

// ── Parse args mapping from function file source ────────────────────────────
//
// Looks for patterns like:
//   const name  = String(args[0] !== undefined ? args[0] : '').trim();
//   const index = args[1] !== undefined ? Number(args[1]) : 0;
//   const userID = args[0];
//
// Returns Map<varName, argIndex>
function parseArgsMap(src) {
  const map = new Map();
  // Match: const <varName> = <...args[N]...>
  const re = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*[^;]*?args\[(\d+)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const varName  = m[1];
    const argIndex = parseInt(m[2], 10);
    if (!map.has(varName)) map.set(varName, argIndex);
  }
  return map;
}

// ── Determine relative path to fnError ─────────────────────────────────────
function fnErrorPath(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(__dirname, '..', 'src', 'core', 'fnError'));
  return rel.startsWith('.') ? rel : './' + rel;
}

// ── Transform a single file ─────────────────────────────────────────────────
function transformFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');

  // Skip files with no legacy [error: patterns
  if (!src.includes('[error:')) return { changed: false };

  const argsMap = parseArgsMap(src);
  let changed   = false;
  let newSrc    = src;

  // ── Pattern 1: return '[error: $fn — <varName> is required]'
  //   Transforms to: return argError(context, 'display name', 'Type', varName);
  newSrc = newSrc.replace(
    /return\s*(['"`])\[error:\s*\$[A-Za-z0-9_.]+\s*[—–-]+\s*([a-zA-Z][a-zA-Z0-9 _]*?)\s+is required[^\]]*\]\1\s*;/g,
    (match, quote, rawArgName) => {
      // Try to find the variable name from the argsMap
      const normName = rawArgName.trim().replace(/\s+/g, '');
      const candidates = [...argsMap.keys()].filter(k =>
        k.toLowerCase() === normName.toLowerCase() ||
        k.toLowerCase().includes(normName.toLowerCase()) ||
        normName.toLowerCase().includes(k.toLowerCase())
      );
      if (!candidates.length) return match; // can't safely transform
      const varName   = candidates[0];
      const type      = inferType(varName);
      const dispName  = displayName(varName);
      changed = true;
      return `return argError(context, '${dispName}', '${type}', ${varName});`;
    }
  );

  // ── Pattern 2: return '[error: $fn — <varName> must be a valid number/integer]'
  newSrc = newSrc.replace(
    /return\s*(['"`])\[error:\s*\$[A-Za-z0-9_.]+\s*[—–-]+\s*([a-zA-Z][a-zA-Z0-9 _]*?)\s+(?:must be a valid|is not a valid)\s+(?:number|integer|float|numeric)[^\]]*\]\1\s*;/g,
    (match, quote, rawArgName) => {
      const normName = rawArgName.trim().replace(/\s+/g, '');
      const candidates = [...argsMap.keys()].filter(k =>
        k.toLowerCase() === normName.toLowerCase() ||
        k.toLowerCase().includes(normName.toLowerCase()) ||
        normName.toLowerCase().includes(k.toLowerCase())
      );
      if (!candidates.length) return match;
      const varName  = candidates[0];
      const dispName = displayName(varName);
      changed = true;
      return `return argError(context, '${dispName}', 'number', ${varName});`;
    }
  );

  // ── Pattern 3: return '[error: $fn — argument must be a valid number/integer]'
  //   (generic "argument" with no specific name — use args[0] and argName 'value')
  newSrc = newSrc.replace(
    /return\s*(['"`])\[error:\s*\$[A-Za-z0-9_.]+\s*[—–-]+\s*argument\s+(?:must be a valid|is not a valid)\s+(?:number|integer|float|numeric)[^\]]*\]\1\s*;/g,
    (match) => {
      changed = true;
      return `return argError(context, 'value', 'number', args[0]);`;
    }
  );

  // ── Pattern 4: return '[error: $fn requires <label>]'  (single arg required)
  newSrc = newSrc.replace(
    /return\s*(['"`])\[error:\s*\$[A-Za-z0-9_.]+\s+requires\s+a?\s*([a-zA-Z][a-zA-Z0-9 _]*?)\]\1\s*;/g,
    (match, quote, rawLabel) => {
      const label     = rawLabel.trim();
      const normName  = label.replace(/\s+/g, '');
      const candidates = [...argsMap.keys()].filter(k =>
        k.toLowerCase().includes(normName.toLowerCase()) ||
        normName.toLowerCase().includes(k.toLowerCase())
      );
      if (!candidates.length) return match;
      const varName  = candidates[0];
      const type     = inferType(varName);
      const dispName = displayName(varName);
      changed = true;
      return `return argError(context, '${dispName}', '${type}', ${varName});`;
    }
  );

  if (!changed) return { changed: false };

  // ── Add argError import if not already present ───────────────────────────
  const hasArgErrorImport = /argError/.test(newSrc);
  if (!hasArgErrorImport) {
    const relPath = fnErrorPath(filePath).replace(/\\/g, '/');

    // If fnError is already imported, add argError to the destructure
    const existingFnErrorImport = newSrc.match(/const\s+fnError\s*=\s*require\(['"](.*?fnError.*?)['"]\)/);
    if (existingFnErrorImport) {
      newSrc = newSrc.replace(
        /const\s+fnError\s*=\s*require\((['"].*?fnError.*?['"])\)/,
        `const fnError   = require($1)\nconst { argError } = require($1)`
      );
    } else {
      // Inject after 'use strict'; line
      newSrc = newSrc.replace(
        /^('use strict';\s*\n)/,
        `$1\nconst { argError } = require('${relPath}');\n`
      );
    }
  }

  return { changed: true, newSrc };
}

// ── Main ────────────────────────────────────────────────────────────────────
const files       = walkDir(ROOT);
let   transformed = 0;
let   skipped     = 0;
const errors      = [];

for (const file of files) {
  try {
    const { changed, newSrc } = transformFile(file);
    if (!changed) { skipped++; continue; }

    if (DRY_RUN) {
      console.log(`[dry-run] would update: ${path.relative(process.cwd(), file)}`);
    } else {
      fs.writeFileSync(file, newSrc, 'utf8');
    }
    transformed++;
  } catch (err) {
    errors.push({ file, err: err.message });
  }
}

console.log(`\n✅  Done.`);
console.log(`   Transformed : ${transformed} files`);
console.log(`   Unchanged   : ${skipped} files (no matching patterns or already up-to-date)`);
if (errors.length) {
  console.log(`   Errors      : ${errors.length}`);
  for (const e of errors) console.log(`     ⚠️  ${path.relative(process.cwd(), e.file)}: ${e.err}`);
}
if (DRY_RUN) console.log('\n   (dry-run — no files were written)');
