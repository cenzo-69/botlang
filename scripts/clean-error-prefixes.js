'use strict';

/**
 * Strips the redundant `$funcName — ` prefix from [error: ...] strings
 * inside all function files.
 *
 * Before: [error: $arrayAt — array name is required]
 * After:  [error: Array name is required!]
 *
 * Also capitalises the first letter and ensures the message ends with `!`
 * (unless it already ends with another punctuation mark).
 */

const fs   = require('fs');
const path = require('path');

const FUNCTIONS_DIR = path.join(__dirname, '..', 'src', 'functions');

// Matches the $funcName — prefix inside an [error: ...] string literal
// Handles: — – - (em-dash, en-dash, hyphen) and optional spaces
const PREFIX_RE = /(\[error:\s*)\$[A-Za-z0-9_.]+\s*(?:—|–|-{1,3})\s*/g;

let filesChanged = 0;
let replacements = 0;

function processDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { processDir(full); continue; }
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;

    let src = fs.readFileSync(full, 'utf8');
    let count = 0;

    // Strip $funcName — prefixes
    src = src.replace(PREFIX_RE, (_, bracket) => {
      count++;
      return bracket;
    });

    // Capitalise the first letter of each [error: message] and ensure trailing !
    src = src.replace(/\[error:\s*([^\]]+)\]/g, (match, inner) => {
      let msg = inner.trim();
      // Capitalise first character
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
      // Add ! if not already ending with !, ?, or .
      if (!/[!?.`']$/.test(msg)) msg += '!';
      return `[error: ${msg}]`;
    });

    if (count > 0) {
      fs.writeFileSync(full, src, 'utf8');
      filesChanged++;
      replacements += count;
      console.log(`  ✓ ${path.relative(FUNCTIONS_DIR, full)} (${count} prefix(es) removed)`);
    }
  }
}

console.log('Cleaning $funcName — prefixes from [error: ...] strings...\n');
processDir(FUNCTIONS_DIR);
console.log(`\nDone. ${replacements} prefix(es) removed across ${filesChanged} file(s).`);
