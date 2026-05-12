'use strict';

const fs   = require('fs');
const path = require('path');

/**
 * Loads event files from `events/` directory.
 *
 * Each event file should export:
 *   module.exports = {
 *     name:    'messageCreate',   // Discord.js event name
 *     once:    false,             // run once? (default: false)
 *     code:    '$sendMessage[...]', // CenzoJS script to run
 *     // — or — execute: async (client, runtime, ...args) => {}
 *   };
 */
class EventLoader {
  constructor(client, runtime) {
    this.client  = client;
    this.runtime = runtime;
  }

  load(eventsDir) {
    if (!fs.existsSync(eventsDir)) {
      console.log('[Events] No events/ directory found — skipping.');
      return this;
    }

    const files = fs.readdirSync(eventsDir)
      .filter(f => f.endsWith('.js') || f.endsWith('.cj'));

    for (const file of files) {
      try {
        const evt = require(path.join(eventsDir, file));
        if (!evt.name) {
          console.warn(`[Events] ${file} is missing a "name" property — skipped.`);
          continue;
        }

        const handler = evt.execute
          ? (...args) => evt.execute(this.client, this.runtime, ...args).catch(e => console.error(`[Events:${evt.name}] ${e.message}`))
          : (...args) => this._runCode(evt, args);

        if (evt.once) {
          this.client.once(evt.name, handler);
        } else {
          this.client.on(evt.name, handler);
        }

        console.log(`[Events] Registered: ${evt.name} (${file})`);
      } catch (err) {
        console.error(`[Events] Failed to load ${file}: ${err.message}`);
      }
    }

    return this;
  }

  async _runCode(evt, args) {
    try {
      // For code-based events: first arg is usually the primary object (message, member, etc.)
      const primary = args[0];
      const message = primary?.constructor?.name === 'Message' ? primary : null;
      await this.runtime.run(evt.code, { message, client: this.client });
    } catch (err) {
      console.error(`[Events:${evt.name}] Runtime error: ${err.message}`);
    }
  }
}

module.exports = EventLoader;
