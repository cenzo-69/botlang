'use strict';

/**
 * CenzoJS — Public Package API
 *
 * Usage:
 *   const { cenzoClient, GatewayIntentBits } = require('@cenzotz/cenzojs');
 *
 *   const client = new cenzoClient({
 *     token:   process.env.TOKEN,
 *     intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ],
 *     prefix:  ['!'],
 *     folders: { commands: './commands', events: './events' },
 *   });
 */

const CenzoClient    = require('./CenzoClient');
const Runtime        = require('./core/Runtime');
const Parser         = require('./core/Parser');
const Interpreter    = require('./core/Interpreter');
const FunctionLoader = require('./core/FunctionLoader');
const Context        = require('./core/Context');
const InviteTracker  = require('./core/InviteTracker');

const { FrameworkError, ParseError, RuntimeError } = require('./core/errors');

// Re-export commonly needed discord.js primitives so consumers
// don't need a separate discord.js import for the basic things.
const {
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  Partials,
} = require('discord.js');

module.exports = {
  // ── Primary API ────────────────────────────────────────────────────────────
  cenzoClient: CenzoClient,
  CenzoClient,              // named alias — both work

  // ── Framework internals (for advanced use / extending) ─────────────────────
  Runtime,
  Parser,
  Interpreter,
  FunctionLoader,
  Context,
  InviteTracker,

  // ── Error types ────────────────────────────────────────────────────────────
  FrameworkError,
  ParseError,
  RuntimeError,

  // ── discord.js re-exports ──────────────────────────────────────────────────
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  Partials,

  // ── Convenience factory ────────────────────────────────────────────────────
  createRuntime(options = {}) {
    return new Runtime(options);
  },
};
