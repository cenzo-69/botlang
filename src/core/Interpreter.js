'use strict';

const { FrameworkError, RuntimeError } = require('./errors');

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
      default:         return '';
    }
  }

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

    // Resolve args BEFORE creating child context —
    // args are evaluated in the caller's scope, not the function's scope.
    const resolvedArgs = args
      ? await this.resolveArgs(args, lazyIndices, context)
      : [];

    // Create child context; push this function onto the call stack for tracing.
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
      // Enrich the error with call stack information before re-throwing
      if (err instanceof FrameworkError || err instanceof RuntimeError) {
        if (!err.callStack || err.callStack.length === 0) {
          err.callStack = childCtx.callStack;
        }
        throw err;
      }
      throw new RuntimeError(err.message, originalName, childCtx.callStack);
    }
  }

  async resolveArgs(argNodes, lazyIndices, context) {
    const resolved = [];
    for (let i = 0; i < argNodes.length; i++) {
      if (lazyIndices.includes(i)) {
        // Pass raw node array — the function controls when/if it runs
        resolved.push(argNodes[i]);
      } else {
        resolved.push(await this.executeNodes(argNodes[i], context));
      }
    }
    return resolved;
  }
}

module.exports = Interpreter;
