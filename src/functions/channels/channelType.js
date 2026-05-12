'use strict';

const { ChannelType } = require('discord.js');

const TYPE_NAMES = {
  [ChannelType.GuildText]:          'text',
  [ChannelType.DM]:                 'dm',
  [ChannelType.GuildVoice]:         'voice',
  [ChannelType.GroupDM]:            'groupdm',
  [ChannelType.GuildCategory]:      'category',
  [ChannelType.GuildAnnouncement]:  'announcement',
  [ChannelType.AnnouncementThread]: 'thread',
  [ChannelType.PublicThread]:       'thread',
  [ChannelType.PrivateThread]:      'thread',
  [ChannelType.GuildStageVoice]:    'stage',
  [ChannelType.GuildForum]:         'forum',
  [ChannelType.GuildMedia]:         'media',
};

// $channelType[channelID?]
// Returns the type of a channel as a string (text, voice, category, etc.)
module.exports = async (context, args) => {
  const channelID = String(args[0] !== undefined ? args[0] : '').trim();
  if (!context.client) return '[error: $channelType — no client]';

  try {
    const channel = channelID
      ? await context.client.channels.fetch(channelID)
      : context.message?.channel;
    if (!channel) return '[error: $channelType — channel not found]';
    return TYPE_NAMES[channel.type] ?? String(channel.type);
  } catch (err) {
    return `[error: $channelType — ${err.message}]`;
  }
};
