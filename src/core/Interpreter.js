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
    const { name, originalName, args } = node;
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

    try {
      const result = await execute(childCtx, resolvedArgs);

      // Propagate stop signal from child back to caller
      if (childCtx.stopped) context.stop();

      if (result === null || result === undefined) return '';
      return String(result);
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
      // Copy line info if available (future: from parser)
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
}

module.exports = Interpreter;
