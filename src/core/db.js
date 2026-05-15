'use strict';

/**
 * Persistent key-value store backed by PostgreSQL (cenzo_db table).
 * All methods are async — always await them.
 */

const { pool, init } = require('./pgdb');

module.exports = {
  async set(key, value) {
    await init();
    await pool.query(
      `INSERT INTO cenzo_db (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [String(key), String(value)]
    );
  },

  async get(key, defaultValue = null) {
    await init();
    const { rows } = await pool.query(
      'SELECT value FROM cenzo_db WHERE key = $1',
      [String(key)]
    );
    return rows.length ? rows[0].value : defaultValue;
  },

  async delete(key) {
    await init();
    await pool.query(
      'DELETE FROM cenzo_db WHERE key = $1',
      [String(key)]
    );
  },

  async has(key) {
    await init();
    const { rows } = await pool.query(
      'SELECT 1 FROM cenzo_db WHERE key = $1',
      [String(key)]
    );
    return rows.length > 0;
  },

  async all() {
    await init();
    const { rows } = await pool.query(
      'SELECT key, value FROM cenzo_db ORDER BY key'
    );
    return Object.fromEntries(rows.map(r => [r.key, r.value]));
  },
};
