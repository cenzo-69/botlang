#!/usr/bin/env node
'use strict';

/**
 * Injects the argError import into any function file that calls argError()
 * but has no import for it. Also fixes display names like "user i d" → "user ID".
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src', 'functions');

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) results.push(full);
  }
  return results;
}

// Better display name: keeps "ID" uppercase, avoids "i d" artifacts
function fixDisplayName(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')  // e.g. "userID" → "user ID"
    .replace(/([a-z])([A-Z])/g, '$1 $2')          // e.g. "userName" → "user Name"
    .replace(/\bId\b/g, 'ID')
    .replace(/\bid\b/gi, 'ID')
    .toLowerCase()
    .replace(/\bid\b/g, 'ID')
    .trim();
}

let fixed   = 0;
let skipped = 0;

for (const filePath of walkDir(ROOT)) {
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // ── Fix: inject missing argError import ─────────────────────────────────
  const hasCall   = /\bargError\(/.test(src);
  const hasImport = /\bargError\b.*require/.test(src) || /require\([^)]*fnError[^)]*\).*\bargError\b/.test(src) || /\{\s*argError\s*\}/.test(src);

  if (hasCall && !hasImport) {
    const depth   = path.relative(ROOT, path.dirname(filePath)).split(path.sep).filter(Boolean).length;
    const prefix  = '../'.repeat(depth + 1); // relative path from src/functions/X/ to src/
    const relPath = `${prefix}core/fnError`;

    // If file already imports fnError (default export), append argError destructure
    const fnErrorMatch = src.match(/^(const\s+fnError\s*=\s*require\('[^']+'\));/m);
    if (fnErrorMatch) {
      src = src.replace(
        /^(const\s+fnError\s*=\s*require\('[^']+'\));/m,
        `$1\nconst { argError } = require('${relPath}');`
      );
    } else {
      // Inject after 'use strict'; line
      src = src.replace(
        /^('use strict';)\n/m,
        `'use strict';\n\nconst { argError } = require('${relPath}');\n`
      );
    }
    changed = true;
  }

  // ── Fix: "user i d" → "user ID" display name artifact ──────────────────
  if (/argError\(context, '[^']*\si\sd'/.test(src)) {
    src = src.replace(
      /argError\(context, '([^']+)'/g,
      (match, dispName) => {
        const fixed = dispName.replace(/\b(i\s*d)\b/gi, 'ID').replace(/\s+/g, ' ').trim();
        return `argError(context, '${fixed}'`;
      }
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`✅  Done.`);
console.log(`   Fixed   : ${fixed} files`);
console.log(`   Skipped : ${skipped} files`);
