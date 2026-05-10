# CenzoJS — Discord Bot Scripting Framework

A professional runtime engine for a Discord bot scripting language, similar to BDFD, ForgeScript, and BotForge. Built with Node.js and discord.js v14.

## Project Overview

CenzoJS is a full parser/interpreter runtime that turns a `$function[arg;arg]` scripting syntax into real Discord bot actions. The engine is modular, scalable, and designed for npm publishing.

## Architecture

```
src/
├── core/
│   ├── errors.js         Error types (FrameworkError, ParseError, RuntimeError)
│   ├── Context.js        Execution context (message, client, variables, depth)
│   ├── Parser.js         Recursive descent parser → AST
│   ├── Interpreter.js    AST walker / executor (inside-out evaluation)
│   ├── FunctionLoader.js Auto-loads function files from a directory
│   └── Runtime.js        Main orchestrator — parse + execute pipeline
├── functions/            42 built-in functions (auto-loaded)
└── index.js              Public API exports

index.js                  Bot entry point (discord.js client + command loader)
commands/                 Example command files
test.js                   Standalone test suite (no Discord needed)
```

## How the Parser Works

1. **Parser** (`Parser.js`) — Recursive descent, character-level. Produces a typed AST:
   - `{ type: 'program', body: [...] }`
   - `{ type: 'function', name, originalName, args: [[...nodes]] }`
   - `{ type: 'text', value }`
2. **Interpreter** (`Interpreter.js`) — Walks the AST. Resolves args by recursing into their node arrays **before** calling the function (inside-out). Lazy args receive raw node arrays so functions like `$loop` and `$if` can control when/if they execute.
3. **Context** (`Context.js`) — Carries `message`, `client`, `variables` (shared Map), `depth` (for recursion limiting), `stopped` flag, and loop metadata.

## Function File Format

```js
// Simple function
module.exports = async (context, args) => {
  return args[0];
};

// Function with lazy args (raw node arrays instead of resolved strings)
module.exports = {
  lazy: [1, 2],  // arg indices that receive raw AST nodes
  execute: async (context, args) => {
    const condition = args[0]; // resolved string
    const thenNodes = args[1]; // raw nodes — call context.executeNodes(thenNodes)
    if (condition) return context.executeNodes(thenNodes);
    return '';
  },
};
```

## Built-in Functions

### Discord
- `$username` `$userID` `$userTag`
- `$avatar[userID]`
- `$mentioned[index;fallbackToAuthor]`
- `$channelID` `$channelName`
- `$guildID` `$guildName` `$memberCount`
- `$sendMessage[content;channelID?]`
- `$reply[content]`
- `$deleteMessage[delayMs?]`

### Variables (session-scoped)
- `$var[name;value]`
- `$getVar[name;default?]`
- `$deleteVar[name]`

### Control Flow
- `$stop`
- `$if[condition;thenCode;elseCode]`
- `$equals[a;b;then?;else?]`
- `$loop[count;code]` + `$loopIndex` `$loopNumber`
- `$and[...conditions]` `$or[...conditions]` `$not[value]`

### Math & Numbers
- `$math[expression]` — full arithmetic: `+ - * / % ^ ()`
- `$random[min;max]` or `$random[max]`
- `$eval[jsExpression]` — safe sandboxed JS eval
- `$evalDJS[code]` — full discord.js access eval

### Strings
- `$upper[text]` `$lower[text]` `$length[text]` `$trim[text]`
- `$replace[text;search;replacement]`
- `$includes[text;search]`
- `$slice[text;start;end?]`
- `$split[text;sep;index?]`
- `$repeat[text;count;sep?]`
- `$newline` `$space[n?]`

### Misc
- `$time` `$time[format]` — YYYY MM DD HH mm ss tokens

## Adding Custom Functions

Place any `.js` file in `src/functions/` and it's auto-loaded on next start.

Or register at runtime:
```js
const { Runtime } = require('./src');
const runtime = new Runtime();
runtime.register('hello', async (context, args) => `Hello, ${args[0]}!`);
```

## Running

1. Add `DISCORD_TOKEN=your_token_here` to `.env`
2. Add commands to `commands/` (see examples)
3. `npm start`

## Testing (no Discord required)

```sh
npm test
```

## User Preferences

- Functions use `(context, args)` signature — never `(message, args)`
- All function files use `'use strict';`
- Lazy evaluation is signaled by `{ lazy: [indices], execute: fn }` export format
- Errors should be explicit (`[error message]`) not silent empty strings
