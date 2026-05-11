'use strict';

const fs = require('fs');
const path = require('path');

class FunctionLoader {
  constructor() {
    this.functions = new Map();
  }

  load(dir) {
    if (!fs.existsSync(dir)) {
      console.warn(`[FunctionLoader] Directory not found: ${dir}`);
      return this;
    }

    this._loadDir(dir);
    return this;
  }

  _loadDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        this._loadDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const key = path.basename(entry.name, '.js').toLowerCase();
        try {
          delete require.cache[require.resolve(fullPath)];
          const mod = require(fullPath);
          this.register(key, mod);
        } catch (err) {
          console.error(`[FunctionLoader] Failed to load ${entry.name}: ${err.message}`);
        }
      }
    }
  }

  register(name, fn) {
    const key = String(name).toLowerCase();
    if (typeof fn !== 'function' && typeof fn?.execute !== 'function') {
      console.warn(`[FunctionLoader] Skipping "${key}" — must export a function or { execute }`);
      return this;
    }
    this.functions.set(key, fn);
    return this;
  }

  unregister(name) {
    this.functions.delete(String(name).toLowerCase());
    return this;
  }

  has(name) {
    return this.functions.has(String(name).toLowerCase());
  }

  get(name) {
    return this.functions.get(String(name).toLowerCase());
  }

  list() {
    return [...this.functions.keys()];
  }
}

module.exports = FunctionLoader;
