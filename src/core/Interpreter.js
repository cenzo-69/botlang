'use strict';

const { FrameworkError, RuntimeError } = require('./errors');
const evaluateCondition                = require('./evaluateCondition');

// Regex that matches the legacy "[error: ...]" return format used by function files.
// Captures everything between the outer brackets.
const LEGACY_ERROR_RE = /^\[error:\s*([\s\S]+)\]$/;

class Interpreter {
  constructor(functions) {
    this.functions = functions; // Map<string, fn | { execute, lazy }>
  }

  async execute(ast, context) {
    return this.executeNodes(ast.body, context);
  }

  async executeNodes(nodes, context) {
    let result = '';
    for (const node of nodes) {
      if (context.stopped) break;
      result += await this.executeNode(node, context);
    }
    return result;
  }

  async executeNode(node, context) {
    switch (node.type) {
      case 'text':     return node.value;
      case 'function': return this.executeFunction(node, context);
      case 'block_if': return this.executeBlockIf(node, context);
      default:         return '';
    }
  }

  // ── Block $if execution ───────────────────────────────────────────────────
  async executeBlockIf(node, context) {
    for (const branch of node.branches) {
      if (context.stopped) break;

      if (branch.condition === null) {
        return this.executeNodes(branch.body, context);
      }

      const condStr = await this.executeNodes(branch.condition, context);
      if (evaluateCondition(condStr)) {
        return this.executeNodes(branch.body, context);
      }
    }
    return '';
  }

  // ── Inline function execution ─────────────────────────────────────────────
  async executeFunction(node, context) {
    const { name, originalName, args, raw } = node;
    const fn = this.functions.get(name);

    // Unknown function — pass through as literal text
    if (!fn) {
      if (args === null) return `$${originalName}`;
      const flat = await this.resolveArgs(args, [], context);
      return `$${originalName}[${flat.join(';')}]`;
    }

    const execute     = typeof fn === 'function' ? fn : fn.execute;
    const lazyIndices = (typeof fn === 'object' && fn.lazy) ? fn.lazy : [];

    const resolvedArgs = args
      ? await this.resolveArgs(args, lazyIndices, context)
      : [];

    const childCtx        = context.child();
    childCtx.functionName = originalName;
    childCtx.callStack    = [...context.callStack, originalName];
    // Store the raw call-site text so functions can use it in argError() messages.
    // Falls back to a reconstructed representation if raw is unavailable.
    childCtx.callSiteRaw  = raw || this._buildCallSite(originalName, resolvedArgs, lazyIndices);

    try {
      const result = await execute(childCtx, resolvedArgs);

      // Propagate stop signal from child back to caller
      if (childCtx.stopped) context.stop();

      if (result === null || result === undefined) return '';

      const str = String(result);

      // ── Legacy [error: ...] format ──────────────────────────────────────
      // Automatically reformat to the rich error style and append "at" context.
      const legacyMatch = LEGACY_ERROR_RE.exec(str);
      if (legacyMatch) {
        return this._formatLegacyError(legacyMatch[1], childCtx.callSiteRaw);
      }

      // ── fnError / argError format (⛔ prefix or "Given value" prefix) ───
      // Append "at `call-site`" if not already present.
      if ((str.startsWith('⛔') || str.startsWith('Given value')) && !str.includes('\nat `')) {
        return `${str}\nat \`${childCtx.callSiteRaw}\``;
      }

      return str;
    } catch (err) {
      // Enrich existing framework/runtime errors with call stack info
      if (err instanceof FrameworkError || err instanceof RuntimeError) {
        if (!err.callStack || err.callStack.length === 0) {
          err.callStack = childCtx.callStack;
        }
        throw err;
      }

      // Wrap unexpected JS errors in RuntimeError with full context
      const rErr = new RuntimeError(err.message, originalName, childCtx.callStack);
      throw rErr;
    }
  }

  async resolveArgs(argNodes, lazyIndices, context) {
    const resolved = [];
    for (let i = 0; i < argNodes.length; i++) {
      if (lazyIndices.includes(i)) {
        resolved.push(argNodes[i]);
      } else {
        resolved.push(await this.executeNodes(argNodes[i], context));
      }
    }
    return resolved;
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Builds a human-readable call-site string from resolved args.
   * Used as a fallback when the Parser's raw text is unavailable.
   */
  _buildCallSite(funcName, resolvedArgs, lazyIndices = []) {
    if (!resolvedArgs || resolvedArgs.length === 0) return `$${funcName}`;
    const parts = resolvedArgs.map((a, i) => {
      if (lazyIndices.includes(i)) return '<code>';
      const s = String(a);
      return s.length > 30 ? s.slice(0, 30) + '…' : s;
    });
    return `$${funcName}[${parts.join(';')}]`;
  }

  /**
   * Reformats a legacy "[error: $funcName — message]" string into the new
   * rich error style:
   *
   *   ⛔ `$funcName` — message
   *   at `$call[site]`
   *
   * If the inner text already looks like a "Given value" argError, it is
   * passed through unchanged (just the "at" line is appended).
   */
  _formatLegacyError(inner, callSite) {
    // Already a rich "Given value" error — just append "at"
    if (inner.startsWith('Given value')) {
      return `${inner}\nat \`${callSite}\``;
    }

    // "$funcName — message" pattern → extract parts
    const dashMatch = inner.match(/^\$?([A-Za-z0-9_.]+)\s*[—–-]+\s*([\s\S]+)$/);
    if (dashMatch) {
      const fn  = dashMatch[1];
      const msg = dashMatch[2].trim();
      return `⛔ \`$${fn}\` — ${msg}\nat \`${callSite}\``;
    }

    // Fallback: wrap the entire inner text
    return `⛔ ${inner}\nat \`${callSite}\``;
  }
}

module.exports = Interpreter;
