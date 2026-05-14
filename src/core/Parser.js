'use strict';

const { ParseError } = require('./errors');

/**
 * Recursive descent parser.
 *
 * Grammar:
 *   Program      := Segment*
 *   Segment      := FunctionCall | Text
 *   FunctionCall := '$' Identifier ('[' ArgList ']')?
 *                 | BlockIf          (when $if has exactly 1 arg)
 *   ArgList      := Arg (';' Arg)*
 *   Arg          := Segment*          (stops at ';' or ']')
 *   BlockIf      := '$if[' Cond ']' Body ($elseif[Cond] Body)* ($else Body)? $endif
 *   Text         := any chars not '$' (and not ';'/']' when inside an arg)
 *
 * Identifier characters: [a-zA-Z0-9_.]
 *   The dot allows namespaced functions like $db.set, $db.get.
 *
 * Block vs inline $if:
 *   $if[cond]          → block style (1 arg)  — produces a block_if AST node
 *   $if[cond;then]     → inline style (2 args) → dispatched to $if function
 *   $if[cond;then;else]→ inline style (3 args) → dispatched to $if function
 *
 * Escape sequences:
 *   \$ \; \] \[ \\  — produce the literal character
 *
 * Each function AST node carries a `raw` field containing the original source
 * text of the entire call (e.g. "$ban[$mentioned[1];Spam]"). This is used by
 * the Interpreter to produce "at `$func[...]`" in error messages.
 */
class Parser {
  constructor(source) {
    if (typeof source !== 'string') throw new ParseError('Source must be a string');
    this.source = source;
    this.pos    = 0;
    this.length = source.length;
  }

  parse() {
    const body = this.parseSegments(false);
    return { type: 'program', body };
  }

  // ── Segment parser ─────────────────────────────────────────────────────────
  //
  // inArg  = true  → stop at ';' or ']'  (inside a function argument)
  // stopAt = array of lowercase names that stop parsing without consuming
  //          them (used by block parsing so the caller can handle the keyword)
  parseSegments(inArg, stopAt = []) {
    const nodes  = [];
    let textBuf  = '';

    while (this.pos < this.length) {
      const ch = this.source[this.pos];

      // Escape sequences
      if (ch === '\\' && this.pos + 1 < this.length) {
        textBuf += this.source[this.pos + 1];
        this.pos += 2;
        continue;
      }

      // Arg-level boundaries
      if (inArg && (ch === ';' || ch === ']')) break;

      if (ch === '$') {
        // Block stop-keyword check (peek without consuming)
        if (stopAt.length) {
          const peeked = this.peekFunctionName();
          if (peeked && stopAt.includes(peeked)) break;
        }
        if (textBuf) {
          nodes.push({ type: 'text', value: textBuf });
          textBuf = '';
        }
        nodes.push(this.parseFunction());
        continue;
      }

      textBuf += ch;
      this.pos++;
    }

    if (textBuf) nodes.push({ type: 'text', value: textBuf });
    return nodes;
  }

  // ── Look-ahead helpers ─────────────────────────────────────────────────────

  // Return the lowercase name of the next $function without moving pos.
  peekFunctionName() {
    if (this.pos >= this.length || this.source[this.pos] !== '$') return null;
    let i    = this.pos + 1;
    let name = '';
    while (i < this.length && /[a-zA-Z0-9_.]/.test(this.source[i])) {
      name += this.source[i++];
    }
    return name.toLowerCase() || null;
  }

  // Consume '$keyword' advancing pos past the identifier (no arg parsing).
  consumeKeyword() {
    this.pos++; // skip '$'
    while (this.pos < this.length && /[a-zA-Z0-9_.]/.test(this.source[this.pos])) {
      this.pos++;
    }
  }

  // ── Function parser ────────────────────────────────────────────────────────
  parseFunction() {
    const startPos = this.pos; // capture start of '$funcName[...]' for raw text

    this.pos++; // consume '$'

    let name = '';
    while (this.pos < this.length && /[a-zA-Z0-9_.]/.test(this.source[this.pos])) {
      name += this.source[this.pos++];
    }
    const nameBefore = name.length;
    name = name.replace(/\.+$/, ''); // strip trailing dots
    this.pos -= (nameBefore - name.length); // rewind past stripped dots so they remain as literal text

    // Bare '$' with no identifier → literal text
    if (!name) return { type: 'text', value: '$' };

    let args = null;
    if (this.pos < this.length && this.source[this.pos] === '[') {
      this.pos++; // consume '['
      args = this.parseArgList();
      if (this.pos < this.length && this.source[this.pos] === ']') {
        this.pos++; // consume ']'
      } else {
        throw new ParseError(`Missing closing ']' for $${name}`, this.pos);
      }
    }

    // ── Block $if detection ────────────────────────────────────────────────
    // Exactly 1 arg  → block-style:  $if[cond] body $endif
    // 2 or more args → inline-style: $if[cond;then;else?]  (existing path)
    if (name.toLowerCase() === 'if' && args !== null && args.length === 1) {
      return this.parseBlockIf(args[0]);
    }

    return {
      type:         'function',
      name:         name.toLowerCase(),
      originalName: name,
      args,
      raw:          this.source.slice(startPos, this.pos), // full raw source text of this call
    };
  }

  // ── Block $if / $elseif / $else / $endif ──────────────────────────────────
  parseBlockIf(conditionNodes) {
    const branches = [];
    const BLOCK_STOP = ['elseif', 'else', 'endif'];

    // ── Then body ────────────────────────────────────────────────────────────
    const thenBody = this.parseSegments(false, BLOCK_STOP);
    branches.push({ condition: conditionNodes, body: thenBody });

    // ── $elseif / $else / $endif loop ─────────────────────────────────────
    while (this.pos < this.length) {
      const kw = this.peekFunctionName();

      // ── $endif ────────────────────────────────────────────────────────────
      if (kw === 'endif') {
        this.consumeKeyword();
        break;
      }

      // ── $else ─────────────────────────────────────────────────────────────
      if (kw === 'else') {
        this.consumeKeyword();
        // Allow optional empty brackets: $else[]
        if (this.pos < this.length && this.source[this.pos] === '[') {
          this.pos++;
          if (this.pos < this.length && this.source[this.pos] === ']') this.pos++;
        }
        const elseBody = this.parseSegments(false, ['endif']);
        branches.push({ condition: null, body: elseBody });
        if (this.peekFunctionName() === 'endif') this.consumeKeyword();
        break;
      }

      // ── $elseif ───────────────────────────────────────────────────────────
      if (kw === 'elseif') {
        this.consumeKeyword();
        let elseifCond = [];
        if (this.pos < this.length && this.source[this.pos] === '[') {
          this.pos++; // consume '['
          const condArgs = this.parseArgList();
          if (this.pos < this.length && this.source[this.pos] === ']') this.pos++;
          elseifCond = condArgs[0] || [];
        }
        const elseifBody = this.parseSegments(false, BLOCK_STOP);
        branches.push({ condition: elseifCond, body: elseifBody });
        continue;
      }

      // Unknown / no keyword found — stop gracefully (missing $endif)
      break;
    }

    return { type: 'block_if', originalName: 'if', branches };
  }

  // ── Arg list parser ────────────────────────────────────────────────────────
  parseArgList() {
    const args = [];
    while (this.pos < this.length && this.source[this.pos] !== ']') {
      args.push(this.parseSegments(true));
      if (this.pos < this.length && this.source[this.pos] === ';') {
        this.pos++; // consume ';'
      }
    }
    return args;
  }
}

module.exports = Parser;
