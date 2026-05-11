'use strict';

const { ChannelType } = require('discord.js');

// $createChannel[name;type?]
// Creates a channel in the guild. Returns the new channel ID.
// type: text (default), voice, category, stage, forum, announcement
const TYPE_MAP = {
  text:         ChannelType.GuildText,
  voice:        ChannelType.GuildVoice,
  category:     ChannelType.GuildCategory,
  stage:        ChannelType.GuildStageVoice,
  forum:        ChannelType.GuildForum,
  announcement: ChannelType.GuildAnnouncement,
};

module.exports = async (context, args) => {
  const guild = context.message?.guild;
  if (!guild) return '[error: no guild]';
  const name     = String(args[0] || 'new-channel');
  const typeName = String(args[1] || 'text').toLowerCase();
  const type     = TYPE_MAP[typeName] ?? ChannelType.GuildText;
  try {
    const channel = await guild.channels.create({ name, type });
    return channel.id;
  } catch (err) {
    return `[error: ${err.message}]`;
  }
};
