'use strict';

const vm = require('vm');

const EVAL_TIMEOUT = 3000;

// $evalDJS[code]  — DEVELOPER / OWNER USE ONLY
//
// Evaluates JavaScript with full discord.js context access.
// This is NOT auto-loaded. You must register it explicitly:
//
//   runtime.register('evalDJS', require('./src/dev/evalDJS'));
//
// ⚠️  WARNING: This allows arbitrary code execution on the host machine.
//    Always restrict it to your bot owner's ID before enabling:
//
//   $onlyIf[$authorID==YOUR_DISCORD_ID]
//   $evalDJS[return message.guild.memberCount]
//
// The sandbox exposes: message, client, channel, guild, author, context,
// and standard globals (Math, JSON, Date, console, require, Promise, …).
module.exports = async (context, args) => {
  const code = String(args[0] || '');
  if (!code) return '';

  const sandbox = {
    message:  context.message,
    client:   context.client,
    channel:  context.message?.channel,
    guild:    context.message?.guild,
    author:   context.message?.author,
    context,
    Math,
    parseInt,
    parseFloat,
    String,
    Number,
    Boolean,
    JSON,
    Date,
    console,
    require,
    Promise,
    setTimeout,
    clearTimeout,
  };

  vm.createContext(sandbox);

  try {
    const wrapped = `(async () => { ${code} })()`;
    const promise = vm.runInContext(wrapped, sandbox, {
      timeout:       EVAL_TIMEOUT,
      displayErrors: false,
    });
    const result = await promise;
    return result === null || result === undefined ? '' : String(result);
  } catch (err) {
    return `[evalDJS error: ${err.message}]`;
  }
};
