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

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(dir, file);
      const key = path.basename(file, '.js').toLowerCase();

      try {
        // Clear require cache on re-load for hot-reload support
        delete require.cache[require.resolve(filePath)];
        const mod = require(filePath);
        this.register(key, mod);
      } catch (err) {
        console.error(`[FunctionLoader] Failed to load ${file}: ${err.message}`);
      }
    }

    return this;
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
