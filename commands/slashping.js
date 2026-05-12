/**
 * Example slash command: /ping
 *
 * To register this as a slash command:
 *   1. Set SLASH_GUILD_IDS=yourGuildID in your .env for instant registration (dev mode).
 *      Leave it blank for global registration (takes up to 1 hour to appear).
 *   2. Restart the bot — slash commands are auto-registered on startup.
 *
 * Supports both prefix and slash:
 *   !ping  →  works as a prefix command
 *   /ping  →  works as a slash command
 */
module.exports = {
  name:        'slashping',
  description: 'Replies with Pong! and shows bot latency',
  slash:       true,        // ← marks this as a slash command
  ephemeral:   false,       // ← set true to make the reply only visible to the user

  // Optional slash command options (arguments):
  options: [
    // {
    //   name:        'message',
    //   description: 'Custom message to echo back',
    //   type:        'string',
    //   required:    false,
    // },
  ],

  // CenzoJS script — runs for both prefix (!slashping) and slash (/slashping)
  code: `🏓 Pong! Latency: **$ping**ms`,
};
