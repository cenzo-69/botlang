'use strict';

require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { Runtime } = require('./src');

// ─── Bot setup ────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const runtime = new Runtime();

// ─── Command loader ───────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

const commands = new Map();

const commandDir = path.join(__dirname, 'commands');
if (fs.existsSync(commandDir)) {
  for (const file of fs.readdirSync(commandDir).filter(f => f.endsWith('.js'))) {
    try {
      const cmd = require(path.join(commandDir, file));
      if (cmd.name && cmd.code) {
        commands.set(cmd.name.toLowerCase(), cmd);
        console.log(`[Commands] Loaded: ${cmd.name}`);
      }
    } catch (err) {
      console.error(`[Commands] Failed to load ${file}: ${err.message}`);
    }
  }
}

// ─── Message handler ──────────────────────────────────────────────────────────

const PREFIX = process.env.PREFIX || '!';

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const input   = message.content.slice(PREFIX.length).trim();
  const cmdName = input.split(/\s+/)[0].toLowerCase();
  const cmd     = commands.get(cmdName);
  if (!cmd) return;

  try {
    const output = await runtime.runForMessage(cmd.code, message);
    if (output.trim()) await message.channel.send(output);
  } catch (err) {
    console.error(`[Runtime Error] ${err.message}`);
    await message.channel.send(`❌ Runtime error: ${err.message}`).catch(() => {});
  }
});

// ─── Ready ────────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
  console.log(`📦 Loaded ${runtime.loader.list().length} functions`);
  console.log(`🤖 Commands: ${[...commands.keys()].join(', ') || 'none'}`);
});

// ─── Login ────────────────────────────────────────────────────────────────────

const token = process.env.DISCORD_TOKEN || process.env.TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN is not set in .env');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error(`❌ Login failed: ${err.message}`);
  process.exit(1);
});
