'use strict';

// ── ANSI colours (console only) ───────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  gray:   '\x1b[90m',
  bgRed:  '\x1b[41m',
};

const isCI = !process.stdout.isTTY; // disable colours in CI/plain logs

function c(colour, str) {
  return isCI ? str : `${colour}${str}${C.reset}`;
}

// ── Discord embed helper ───────────────────────────────────────────────────────
function discordBlock(lines) {
  return lines.filter(Boolean).join('\n');
}

// ── Base CenzoError ────────────────────────────────────────────────────────────
class CenzoError extends Error {
  constructor(message, {
    type         = 'Error',
    functionName = null,
    argPosition  = null,   // 0-based index of the bad argument
    argName      = null,
    line         = null,
    column       = null,
    callStack    = [],
  } = {}) {
    super(message);
    this.name         = type;
    this.type         = type;
    this.functionName = functionName;
    this.argPosition  = argPosition;
    this.argName      = argName;
    this.line         = line;
    this.column       = column;
    this.callStack    = callStack;
  }

  // ── Coloured console output ───────────────────────────────────────────────
  format() {
    const lines = [];

    const typeLabel = c(C.bgRed + C.white + C.bold, ` ${this.type} `);
    const fnLabel   = this.functionName
      ? c(C.cyan + C.bold, `$${this.functionName}`)
      : '';

    lines.push('');
    lines.push(`${typeLabel}${fnLabel ? ' ' + fnLabel : ''}`);
    lines.push(c(C.gray, '─'.repeat(48)));
    lines.push(`${c(C.bold, 'Message  :')} ${c(C.red, this.message)}`);

    if (this.argPosition !== null) {
      const pos  = `Argument ${this.argPosition + 1}`;
      const name = this.argName ? ` (${this.argName})` : '';
      lines.push(`${c(C.bold, 'Argument :')} ${c(C.yellow, pos + name)}`);
    }

    if (this.line !== null) {
      const loc = `line ${this.line}${this.column !== null ? `, col ${this.column}` : ''}`;
      lines.push(`${c(C.bold, 'Location :')} ${c(C.dim, loc)}`);
    }

    if (this.callStack?.length) {
      lines.push(`${c(C.bold, 'Call stack:')} ${this.callStack.map(n => c(C.cyan, `$${n}`)).join(c(C.gray, ' → '))}`);
    }

    lines.push(c(C.gray, '─'.repeat(48)));
    lines.push('');

    return lines.join('\n');
  }

  // ── Discord-formatted error block (for sending to channels) ───────────────
  toDiscord() {
    const header = `⛔ \`${this.type}\`${this.functionName ? ` in \`$${this.functionName}\`` : ''}`;
    const body   = [
      `> **Reason:** ${this.message}`,
    ];
    if (this.argPosition !== null) {
      const name = this.argName ? ` (\`${this.argName}\`)` : '';
      body.push(`> **Argument:** #${this.argPosition + 1}${name}`);
    }
    if (this.line !== null) {
      body.push(`> **Location:** line ${this.line}${this.column !== null ? `, col ${this.column}` : ''}`);
    }
    if (this.callStack?.length) {
      body.push(`> **Call stack:** ${this.callStack.map(n => `\`$${n}\``).join(' → ')}`);
    }
    return discordBlock([header, ...body]);
  }
}

// ── Specialised subclasses ─────────────────────────────────────────────────────

class FrameworkError extends CenzoError {
  constructor(message, functionName = null, callStack = []) {
    super(message, { type: 'FrameworkError', functionName, callStack });
  }
}

class ParseError extends CenzoError {
  constructor(message, pos = null) {
    super(message, {
      type:   'ParseError',
      column: pos,
    });
    this.pos = pos;
  }
}

class RuntimeError extends CenzoError {
  constructor(message, functionName = null, callStack = []) {
    super(message, { type: 'RuntimeError', functionName, callStack });
  }
}

class ArgumentError extends CenzoError {
  constructor(message, functionName, argPosition, argName) {
    super(message, { type: 'ArgumentError', functionName, argPosition, argName });
  }
}

class PermissionError extends CenzoError {
  constructor(message, functionName = null) {
    super(message, { type: 'PermissionError', functionName });
  }
}

class UnknownFunctionError extends CenzoError {
  constructor(name) {
    super(`Unknown function: $${name}`, { type: 'UnknownFunctionError' });
  }
}

module.exports = {
  CenzoError,
  FrameworkError,
  ParseError,
  RuntimeError,
  ArgumentError,
  PermissionError,
  UnknownFunctionError,
};
