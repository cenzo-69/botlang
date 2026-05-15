'use strict';

const { FrameworkError, RuntimeError } = require('./errors');
const evaluateCondition                = require('./evaluateCondition');

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
    const { name, originalName, args, raw, line, col } = node;
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
    childCtx.callSiteRaw  = raw || `$${originalName}`;

    // Position string used in error messages: "line:col"
    const pos = (line != null && col != null) ? `${line}:${col}` : '?:?';

    try {
      const result = await execute(childCtx, resolvedArgs);

      // Propagate stop signal from child back to caller
      if (childCtx.stopped) context.stop();

      if (result === null || result === undefined) return '';

      const str = String(result);

      // Detect any error return and reformat to the unified style
      const errMsg = this._extractErrorMessage(str);
      if (errMsg !== null) {
        return `❌ Function \`$${originalName}\` at \`${pos}\` returned an error: ${errMsg}`;
      }

      return str;
    } catch (err) {
      // Framework/runtime errors get call stack enrichment
      if (err instanceof FrameworkError || err instanceof RuntimeError) {
        if (!err.callStack || err.callStack.length === 0) {
          err.callStack = childCtx.callStack;
        }
        throw err;
      }

      // Unexpected JS errors → return as formatted error string
      return `❌ Function \`$${originalName}\` at \`${pos}\` returned an error: ${err.message}`;
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

  // ── Error message extraction ───────────────────────────────────────────────
  // Detects all error return formats and normalises them to a plain string.
  // Returns null if the string is NOT an error.
  _extractErrorMessage(str) {
    // Format 1: [error: message]  (primary format used by all functions)
    if (str.startsWith('[error:') && str.endsWith(']')) {
      const inner = str.slice(7, -1).trim();
      return inner || 'An unknown error occurred.';
    }

    // Format 2: ⛔ `$fn` — message  (old fnError block format)
    if (str.startsWith('⛔')) {
      const m = str.match(/⛔\s*`[^`]*`\s*(?:—|–|-)\s*([\s\S]+)/);
      if (m) return m[1].split('\n')[0].trim();
      // Plain ⛔ without function name
      return str.replace(/^⛔\s*/, '').split('\n')[0].trim() || 'An unknown error occurred.';
    }

    // Format 3: Given value `X` for argument `Y` is not of type `Z`  (old argError format)
    if (str.startsWith('Given value')) {
      const m = str.match(/Given value `([^`]*)` for argument `([^`]+)` is not of type `([^`]+)`/);
      if (m) {
        const val     = m[1];
        const argName = m[2];
        const type    = m[3];
        if (val === '') return `\`${argName}\` is required!`;
        return `\`${argName}\` must be of type \`${type}\`, got \`${val}\`!`;
      }
    }

    return null;
  }
}

module.exports = Interpreter;
