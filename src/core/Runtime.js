'use strict';

const path           = require('path');
const { EmbedBuilder } = require('discord.js');
const Parser         = require('./Parser');
const Interpreter    = require('./Interpreter');
const FunctionLoader = require('./FunctionLoader');
const Context        = require('./Context');
const { ParseError, RuntimeError } = require('./errors');

// Mention patterns stripped by $noMentionMessage
const MENTION_RE = /<@!?\d+>|<#\d+>|<@&\d+>/g;

class Runtime {
  constructor(options = {}) {
    this.options = {
      maxExecutionTime:    options.maxExecutionTime    || 5000,
      unknownFunctionMode: options.unknownFunctionMode || 'passthrough',
    };

    this.loader = new FunctionLoader();
    this.loader.load(path.join(__dirname, '..', 'functions'));

    this.interpreter = new Interpreter(this.loader.functions);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Register a custom function (or override an existing one) at runtime. */
  register(name, fn) {
    this.loader.register(name, fn);
    return this;
  }

  /** Load an additional directory of function files. */
  loadDir(dir) {
    this.loader.load(dir);
    return this;
  }

  /** Parse source → AST (synchronous, reusable). */
  parse(source) {
    try {
      return new Parser(source).parse();
    } catch (err) {
      if (err instanceof ParseError) throw err;
      throw new ParseError(err.message);
    }
  }

  /** Execute an already-parsed AST with an existing Context. */
  async executeAST(ast, context) {
    return this.interpreter.execute(ast, context);
  }

  // ── Core run pipeline ──────────────────────────────────────────────────────

  /**
   * Full pipeline: parse → build context → execute → return text string.
   *
   * This is the backward-compatible entrypoint used by $eval (which re-enters
   * the pipeline with the inherited variable scope but a fresh embed state).
   *
   * NOTE: $eval calls this directly — it does NOT use raw JS eval.
   */
  async run(source, options = {}) {
    const {
      message,
      client,
      variables,
      commandName,
      commandInput,
      commandArgs,
      noMentionInput,
    } = options;

    const ast = this.parse(source);

    const context = new Context({
      message,
      client:         client || message?.client,
      variables:      variables instanceof Map ? variables : new Map(),
      depth:          0,
      runtime:        this,
      commandName:    commandName    || null,
      commandInput:   commandInput   || '',
      commandArgs:    commandArgs    || [],
      noMentionInput: noMentionInput || '',
      // embed starts fresh for each run() call
    });

    return this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );
  }

  // ── Convenience entrypoints ────────────────────────────────────────────────

  /**
   * Run a command triggered by a Discord message.
   * Returns the text output string (backward-compatible).
   *
   * For embed support use runForCommandFull() instead.
   */
  async runForCommand(source, message, prefix = '!') {
    const { text } = await this.runForCommandFull(source, message, prefix);
    return text;
  }

  /**
   * Run a command and return BOTH the text output and any embed that was
   * built during execution via $title / $color / $addField / etc.
   *
   * Returns: { text: string, embed: EmbedBuilder | null }
   *
   * This is the primary entry point for the bot's messageCreate handler.
   */
  async runForCommandFull(source, message, prefix = '!') {
    const raw        = message.content.slice(prefix.length).trim();
    const parts      = raw.match(/\S+/g) || [];
    const cmdName    = parts[0] || '';
    const inputParts = parts.slice(1);
    const cmdInput   = inputParts.join(' ');

    const ast = this.parse(source);

    const context = new Context({
      message,
      client:         message?.client,
      variables:      new Map(),
      depth:          0,
      runtime:        this,
      commandName:    cmdName,
      commandInput:   cmdInput,
      commandArgs:    inputParts,
      noMentionInput: this._stripMentions(cmdInput),
      // embed object created fresh here; shared by reference with all children
    });

    const text = await this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );

    return { text, embed: this._buildEmbed(context) };
  }

  /**
   * Minimal runner — no command parsing.
   * Used for tests, inline embeds, and any case where message.content
   * does not follow the prefix+command format.
   */
  async runForMessage(source, message, extraVars = {}) {
    const variables = new Map(Object.entries(extraVars));
    return this.run(source, { message, variables });
  }

  // ── Embed builder ──────────────────────────────────────────────────────────

  /**
   * Inspect context.embed after execution and return a discord.js EmbedBuilder,
   * or null if no embed fields were set.
   */
  _buildEmbed(context) {
    const e = context.embed;

    const hasContent =
      e.title        ||
      e.description  ||
      e.color        ||
      e.footer.text  ||
      e.author.name  ||
      e.thumbnail    ||
      e.image        ||
      e.timestamp !== null ||
      e.fields.length > 0;

    if (!hasContent) return null;

    const embed = new EmbedBuilder();

    if (e.title) {
      embed.setTitle(e.title);
      if (e.url) embed.setURL(e.url);
    }
    if (e.description) embed.setDescription(e.description);
    if (e.color) {
      const hex = parseInt(String(e.color).replace(/^#/, ''), 16);
      if (!isNaN(hex)) embed.setColor(hex);
    }
    if (e.author.name) {
      embed.setAuthor({
        name:    e.author.name,
        iconURL: e.author.iconURL || undefined,
      });
    }
    if (e.footer.text) {
      embed.setFooter({
        text:    e.footer.text,
        iconURL: e.footer.iconURL || undefined,
      });
    }
    if (e.thumbnail) embed.setThumbnail(e.thumbnail);
    if (e.image)     embed.setImage(e.image);
    if (e.timestamp !== null) embed.setTimestamp(e.timestamp);

    for (const f of e.fields) {
      embed.addFields({ name: f.name, value: f.value, inline: !!f.inline });
    }

    return embed;
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  _stripMentions(text) {
    return text
      .replace(MENTION_RE, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new RuntimeError(label)), ms);
      promise.then(
        v => { clearTimeout(timer); resolve(v); },
        e => { clearTimeout(timer); reject(e);  }
      );
    });
  }
}

module.exports = Runtime;
