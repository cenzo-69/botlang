'use strict';

/**
 * Lightweight persistent key-value store backed by a JSON file.
 *
 * File location: <project root>/data/db.json
 * Operations are synchronous so they are safe to call from async functions
 * without worrying about concurrent write races within a single process.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const DB_FILE  = path.join(DATA_DIR, 'db.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function load() {
  ensureDir();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  set(key, value) {
    const d = load();
    d[String(key)] = value;
    save(d);
  },

  get(key, defaultValue = null) {
    const d = load();
    const k = String(key);
    return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : defaultValue;
  },

  delete(key) {
    const d = load();
    delete d[String(key)];
    save(d);
  },

  has(key) {
    const d = load();
    return Object.prototype.hasOwnProperty.call(d, String(key));
  },

  /** Return all stored data as a plain object (read-only snapshot). */
  all() {
    return load();
  },
};
