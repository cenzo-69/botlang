# CenzoJS

Modern Discord bot scripting framework powered by a custom runtime, parser, and AST execution engine built on top of discord.js.

CenzoJS lets you build Discord bots using custom scripting syntax like:

js id="5yz5q0" $username $title[Hello] $description[Welcome $username] $if[$message==hi] Hello! $endif 

Inspired by:
- BDFD
- ForgeScript
- BotForge

But fully open, extensible, and npm-based.

---

# Features

- Custom $function[] scripting language
- Recursive AST parser
- Nested function execution
- Lazy execution system
- Slash commands
- Events system
- Buttons & interactions
- Embed builder functions
- Variables system
- Conditions & loops
- Runtime architecture
- Modular function loader
- Extensible framework design

---

# Installation

bash id="4s8n0n" npm install @cenzotz/cenzojs 

---

# Project Structure

txt id="40ymzh" project/ ├── commands/ ├── events/ ├── interactions/ ├── index.js └── .env 

---

# Basic Setup

js id="jlwmx5" require("dotenv").config();  const fs = require("fs"); const path = require("path");  const {   Client,   GatewayIntentBits,   Collection } = require("discord.js");  const { Runtime } = require("@cenzotz/cenzojs");  const client = new Client({   intents: [     GatewayIntentBits.Guilds,     GatewayIntentBits.GuildMessages,     GatewayIntentBits.MessageContent,     GatewayIntentBits.GuildMembers   ] });  const runtime = new Runtime();  client.commands = new Collection(); client.events = new Collection(); client.interactions = new Collection();  const PREFIX = "!";  // // COMMAND LOADER //  const commandsPath = path.join(   __dirname,   "commands" );  if (fs.existsSync(commandsPath)) {   const commandFiles = fs     .readdirSync(commandsPath)     .filter(file => file.endsWith(".js"));    for (const file of commandFiles) {     const command = require(       path.join(commandsPath, file)     );      if (!command?.name) continue;      client.commands.set(       command.name,       command     );      console.log(       `[COMMAND] Loaded ${command.name}`     );   } }  // // EVENT LOADER //  const eventsPath = path.join(   __dirname,   "events" );  if (fs.existsSync(eventsPath)) {   const eventFiles = fs     .readdirSync(eventsPath)     .filter(file => file.endsWith(".js"));    for (const file of eventFiles) {     const event = require(       path.join(eventsPath, file)     );      if (!event?.name) continue;      client.events.set(       event.name,       event     );      console.log(       `[EVENT] Loaded ${event.name}`     );      client.on(       event.name,       async (...args) => {         try {           const fakeMessage = args[0];            await runtime.run(             event.code,             {               message: fakeMessage,               client             }           );         } catch (err) {           console.error(err);         }       }     );   } }  // // INTERACTION LOADER //  const interactionsPath = path.join(   __dirname,   "interactions" );  if (fs.existsSync(interactionsPath)) {   const interactionFiles = fs     .readdirSync(interactionsPath)     .filter(file => file.endsWith(".js"));    for (const file of interactionFiles) {     const interaction = require(       path.join(interactionsPath, file)     );      if (!interaction?.customID) continue;      client.interactions.set(       interaction.customID,       interaction     );      console.log(       `[INTERACTION] Loaded ${interaction.customID}`     );   } }  // // MESSAGE COMMAND HANDLER //  client.on(   "messageCreate",   async (message) => {     if (message.author.bot) return;     if (!message.content.startsWith(PREFIX)) return;      const args = message.content       .slice(PREFIX.length)       .trim(

)       .split(/ +/);      const commandName =       args.shift()?.toLowerCase();      const command =       client.commands.get(commandName);      if (!command) return;      try {       await runtime.runForCommand(         command.code,         message,         PREFIX       );     } catch (err) {       console.error(err);     }   } );  // // INTERACTION HANDLER //  client.on(   "interactionCreate",   async (interaction) => {     try {        if (interaction.isButton()) {         const cmd =           client.interactions.get(             interaction.customId           );          if (!cmd) return;          await runtime.run(           cmd.code,           {             interaction,             client           }         );       }        if (interaction.isModalSubmit()) {         const cmd =           client.interactions.get(             interaction.customId           );          if (!cmd) return;          await runtime.run(           cmd.code,           {             interaction,             client           }         );       }      } catch (err) {       console.error(err);     }   } );  client.once("ready", () => {   console.log(     `${client.user.tag} is online`   ); });  client.login(process.env.TOKEN); 

---

# Example Command

js id="vr5gzy" module.exports = {   name: "ping",   code: `   Pong!    Ping: $botPing   ` }; 

---

# Example Event

js id="vkbql3" module.exports = {   name: "guildMemberAdd",   code: `   $channelSendMessage[   $channelID;   Welcome $username   ]   ` }; 

---

# Example Interaction

js id="p6p3n3" module.exports = {   customID: "test",   code: `   Hello $username   ` }; 

---

# Example Embed

js id="q7fngy" module.exports = {   name: "embed",   code: `   $title[CenzoJS]   $description[Custom Discord scripting framework]   $color[#5865F2]    $addField[   Runtime;   AST powered execution;   false   ]    $footer[CenzoJS]   ` }; 

---

# Documentation

Website:
https://cenzojs.site

---

# Support

Discord:
https://discord.gg/2uhpTR6CZD

---

# License

MIT License