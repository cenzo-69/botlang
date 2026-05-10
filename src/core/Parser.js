'use strict';

const { ParseError } = require('./errors');

/**
 * Recursive descent parser.
 *
 * Grammar:
 *   Program   := Segment*
 *   Segment   := FunctionCall | Text
 *   FunctionCall := '$' Identifier ('[' ArgList ']')?
 *   ArgList   := Arg (';' Arg)*
 *   Arg       := Segment*          (stops at ';' or ']')
 *   Text      := any chars not '$' (and not ';'/']' when inside an arg)
 *
 * Escape sequences:
 *   \$ \; \] \[ \\  — produce the literal character
 */
class Parser {
  constructor(source) {
    if (typeof source !== 'string') throw new ParseError('Source must be a string');
    this.source = source;
    this.pos = 0;
    this.length = source.length;
  }

  parse() {
    const body = this.parseSegments(false);
    return { type: 'program', body };
  }

  // inArg=true  → stop at ';' or ']'
  // inArg=false → stop only at end-of-input
  parseSegments(inArg) {
    const nodes = [];
    let textBuf = '';

    while (this.pos < this.length) {
      const ch = this.source[this.pos];

      // Escape sequences
      if (ch === '\\' && this.pos + 1 < this.length) {
        textBuf += this.source[this.pos + 1];
        this.pos += 2;
        continue;
      }

      // Arg boundaries
      if (inArg && (ch === ';' || ch === ']')) break;

      // Function call
      if (ch === '$') {
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

  parseFunction() {
    this.pos++; // consume '$'

    // Read identifier
    let name = '';
    while (this.pos < this.length && /[a-zA-Z0-9_]/.test(this.source[this.pos])) {
      name += this.source[this.pos++];
    }

    // Bare '$' with no identifier — treat as literal text
    if (!name) return { type: 'text', value: '$' };

    // Optional argument list
    let args = null;
    if (this.pos < this.length && this.source[this.pos] === '[') {
      this.pos++; // consume '['
      args = this.parseArgList();

      if (this.pos < this.length && this.source[this.pos] === ']') {
        this.pos++; // consume ']'
      } else {
        throw new ParseError(
          `Missing closing ']' for $${name}`,
          this.pos
        );
      }
    }

    return {
      type: 'function',
      name: name.toLowerCase(),   // canonical lookup key
      originalName: name,          // preserve casing for display
      args,                        // null = no brackets, [] = empty brackets
    };
  }

  parseArgList() {
    const args = [];

    // An empty bracket pair '[]' → one empty arg
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
