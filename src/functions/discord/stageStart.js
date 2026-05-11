'use strict';

// $stageStart[channelID;topic]
// Starts a stage instance in a Stage channel.
// Returns the stage instance ID.
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  const topic     = String(args[1] !== undefined ? args[1] : '').trim();

  if (!channelID) return '[error: $stageStart requires a channelID]';
  if (!topic)     return '[error: $stageStart requires a topic]';
  if (!context.message?.guild) return '[error: $stageStart — not in a guild]';

  try {
    const stage = await context.message.guild.stageInstances.create(channelID, { topic });
    return stage.id;
  } catch (err) {
    return `[error: $stageStart — ${err.message}]`;
  }
};
