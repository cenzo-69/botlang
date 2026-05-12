'use strict';

const path             = require('path');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,
        ButtonStyle, StringSelectMenuBuilder,
        StringSelectMenuOptionBuilder } = require('discord.js');
const Parser           = require('./Parser');
const Interpreter      = require('./Interpreter');
const FunctionLoader   = require('./FunctionLoader');
const Context          = require('./Context');
const { ParseError, RuntimeError } = require('./errors');

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

  register(name, fn) {
    this.loader.register(name, fn);
    return this;
  }

  loadDir(dir) {
    this.loader.load(dir);
    return this;
  }

  parse(source) {
    try {
      return new Parser(source).parse();
    } catch (err) {
      if (err instanceof ParseError) throw err;
      throw new ParseError(err.message);
    }
  }

  async executeAST(ast, context) {
    return this.interpreter.execute(ast, context);
  }

  // ── Core run pipeline ──────────────────────────────────────────────────────

  /**
   * Full pipeline: parse → context → execute → return text string.
   *
   * Used by $eval (which passes the inherited variable scope so variables
   * written inside $eval remain visible outside). $eval uses context.child()
   * so embed / _out / components are already shared — no special handling needed.
   */
  async run(source, options = {}) {
    const {
      message, client, variables,
      commandName, commandInput, commandArgs, noMentionInput,
    } = options;

    const ast     = this.parse(source);
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
    });

    return this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );
  }

  // ── Convenience entrypoints ────────────────────────────────────────────────

  /**
   * Run a command and return BOTH the text output and any embed/components.
   *
   * Returns: { text: string, embed: EmbedBuilder|null, components: ActionRowBuilder[] }
   *
   * If $onlyIf[cond;errorMsg] fails, context._out.stopMessage is set and
   * used as the final text (replacing any text accumulated before the halt).
   */
  async runForCommandFull(source, message, prefix = '!') {
    const raw        = message.content.slice(prefix.length).trim();
    const parts      = raw.match(/\S+/g) || [];
    const cmdName    = parts[0] || '';
    const inputParts = parts.slice(1);
    const cmdInput   = inputParts.join(' ');

    const ast     = this.parse(source);
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
    });

    const rawText = await this._withTimeout(
      this.interpreter.execute(ast, context),
      this.options.maxExecutionTime,
      'Execution timed out'
    );

    // Handle $addPage pagination — send pages and return empty so index.js sends nothing extra
    if (context._out._paginated && context._out._pages?.length) {
      const { sendPaginated } = require('../functions/message/addPage');
      await sendPaginated(message, context._out._pages);
      return { text: '', embed: null, components: [] };
    }

    // $onlyIf error message takes priority over accumulated text
    const text = (context._out.stopMessage !== null)
      ? context._out.stopMessage
      : rawText;

    return {
      text,
      embed:      this._buildEmbed(context),
      components: this._buildComponents(context),
    };
  }

  /**
   * Backward-compatible wrapper — returns the text string only.
   * Used by tests and any code that does not need embed/component output.
   */
  async runForCommand(source, message, prefix = '!') {
    const { text } = await this.runForCommandFull(source, message, prefix);
    return text;
  }

  /**
   * Minimal runner — no command parsing.
   * Used for tests, inline embeds, and message-context execution.
   */
  async runForMessage(source, message, extraVars = {}) {
    const variables = new Map(Object.entries(extraVars));
    return this.run(source, { message, variables });
  }

  // ── Embed builder ──────────────────────────────────────────────────────────

  _buildEmbed(context) {
    const e = context.embed;

    const hasContent =
      e.title || e.description || e.color ||
      e.footer.text || e.author.name ||
      e.thumbnail || e.image ||
      e.timestamp !== null || e.fields.length > 0;

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
    if (e.author.name) embed.setAuthor({ name: e.author.name, iconURL: e.author.iconURL || undefined });
    if (e.footer.text) embed.setFooter({ text: e.footer.text, iconURL: e.footer.iconURL || undefined });
    if (e.thumbnail)   embed.setThumbnail(e.thumbnail);
    if (e.image)       embed.setImage(e.image);
    if (e.timestamp !== null) embed.setTimestamp(e.timestamp);
    for (const f of e.fields) {
      embed.addFields({ name: f.name, value: f.value, inline: !!f.inline });
    }

    return embed;
  }

  // ── Component builder ──────────────────────────────────────────────────────

  _buildComponents(context) {
    if (!context.components.length) return [];

    const rows        = [];
    let   currentBtns = [];

    const flushButtons = () => {
      if (!currentBtns.length) return;
      rows.push(
        new ActionRowBuilder().addComponents(currentBtns.map(b => this._buildButton(b)))
      );
      currentBtns = [];
    };

    for (const comp of context.components) {
      if (comp.type === 'button') {
        if (currentBtns.length >= 5) flushButtons();
        currentBtns.push(comp);
      } else if (comp.type === 'selectMenu') {
        flushButtons();
        try {
          const menu = new StringSelectMenuBuilder()
            .setCustomId(comp.customId || 'menu')
            .setPlaceholder(comp.placeholder || 'Select an option…');

          if (comp.options && comp.options.length) {
            menu.addOptions(
              comp.options.map(o =>
                new StringSelectMenuOptionBuilder()
                  .setLabel(o.label || 'Option')
                  .setValue(o.value || o.label || 'option')
              )
            );
          } else {
            // Discord requires at least 1 option; add a placeholder option
            menu.addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel('Option')
                .setValue('placeholder')
            );
          }

          rows.push(new ActionRowBuilder().addComponents(menu));
        } catch (err) {
          console.warn(`[Runtime] Could not build selectMenu: ${err.message}`);
        }
      }
    }

    flushButtons();
    return rows;
  }

  _buildButton(comp) {
    const styleMap = {
      primary:   ButtonStyle.Primary,
      secondary: ButtonStyle.Secondary,
      success:   ButtonStyle.Success,
      danger:    ButtonStyle.Danger,
      link:      ButtonStyle.Link,
    };
    const style = styleMap[(comp.style || 'primary').toLowerCase()] || ButtonStyle.Primary;
    const btn   = new ButtonBuilder().setLabel(comp.label || 'Button').setStyle(style);

    if (style === ButtonStyle.Link) {
      btn.setURL(comp.customId || 'https://discord.com');
    } else {
      btn.setCustomId(comp.customId || 'btn');
    }

    if (comp.emoji)    btn.setEmoji(comp.emoji);
    if (comp.disabled) btn.setDisabled(true);

    return btn;
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  _stripMentions(text) {
    return text.replace(MENTION_RE, '').replace(/\s+/g, ' ').trim();
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
