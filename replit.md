# CenzoJS — Discord Bot Scripting Framework

## Overview

CenzoJS is a professional Discord bot scripting framework and runtime engine built with Node.js. It implements a custom scripting language (similar to BDFD/ForgeScript) using `$function[args]` syntax to perform Discord actions.

## Running the Bot

The bot requires a `DISCORD_TOKEN` (or `TOKEN`) environment variable set to a valid Discord bot token. Set this in the Secrets panel before starting.

- **Start**: `npm start` — runs `node index.js`
- **Test**: `npm test` — runs 201 framework tests without a Discord connection

## Project Structure

- `index.js` — Main entry point; initializes Discord client and loads commands
- `src/` — Core framework engine
  - `core/` — Parser, Interpreter, Runtime, Context, FunctionLoader
  - `functions/` — 42+ categories of built-in scripting functions
  - `dev/` — Developer utilities
- `commands/` — User-defined bot commands written in CenzoJS scripting language
- `data/db.json` — Local persistent key-value storage

## Adding Commands

Create a `.js` file in the `commands/` folder:

```js
module.exports = {
  name: 'mycommand',
  code: '$reply[Hello, $username!]'
};
```

## User Preferences

- No specific preferences recorded yet.
