'use strict';

const { argError } = require('../../core/fnError');

const { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } = require('discord.js');

// $createEvent[name;startTimestamp;endTimestamp;description?;channelID?]
// Creates a Discord scheduled event. startTimestamp and endTimestamp are Unix ms.
// If channelID is provided it becomes a VOICE event, otherwise EXTERNAL (location = "TBD").
// Returns the event ID.
module.exports = async (context, args) => {
  const name      = String(args[0] !== undefined ? args[0] : '').trim();
  const startMs   = parseInt(args[1]);
  const endMs     = parseInt(args[2]);
  const desc      = String(args[3] !== undefined ? args[3] : '').trim() || '';
  const channelID = String(args[4] !== undefined ? args[4] : '').trim();

  if (!name)          return argError(context, 'name', 'string', name);
  if (isNaN(startMs)) return '[error: $createEvent requires a valid start timestamp (ms)!]';
  if (!context.message?.guild) return '[error: Not in a guild!]';

  try {
    const options = {
      name,
      scheduledStartTime: new Date(startMs),
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    };
    if (desc)      options.description = desc;
    if (!isNaN(endMs)) options.scheduledEndTime = new Date(endMs);

    if (channelID) {
      options.entityType = GuildScheduledEventEntityType.Voice;
      options.channel    = channelID;
    } else {
      options.entityType    = GuildScheduledEventEntityType.External;
      options.entityMetadata = { location: 'TBD' };
      if (!options.scheduledEndTime) {
        options.scheduledEndTime = new Date(startMs + 3_600_000);
      }
    }

    const event = await context.message.guild.scheduledEvents.create(options);
    return event.id;
  } catch (err) {
    return `[error: ${err.message}!]`;
  }
};
