'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[pgdb] Unexpected pool error:', err.message);
});

let initialized = false;

async function init() {
  if (initialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cenzo_db (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cenzo_user_vars (
        user_id TEXT    NOT NULL,
        name    TEXT    NOT NULL,
        value   TEXT    NOT NULL,
        PRIMARY KEY (user_id, name)
      );

      CREATE TABLE IF NOT EXISTS cenzo_server_vars (
        guild_id TEXT NOT NULL,
        name     TEXT NOT NULL,
        value    TEXT NOT NULL,
        PRIMARY KEY (guild_id, name)
      );

      CREATE TABLE IF NOT EXISTS cenzo_channel_vars (
        channel_id TEXT NOT NULL,
        name       TEXT NOT NULL,
        value      TEXT NOT NULL,
        PRIMARY KEY (channel_id, name)
      );
    `);
    initialized = true;
    console.log('[pgdb] Tables ready.');
  } catch (err) {
    console.error('[pgdb] Init failed:', err.message);
    throw err;
  }
}

module.exports = { pool, init };
