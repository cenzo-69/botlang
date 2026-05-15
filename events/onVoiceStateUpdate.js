'use strict';

module.exports = {
  name: 'onVoiceStateUpdate',

  code: [
    '$title[$if[$getVar[voiceAction]==joined;🔊 Joined Voice;$if[$getVar[voiceAction]==left;🔇 Left Voice;🔀 Moved Voice]]]',
    '$color[$if[$getVar[voiceAction]==joined;57F287;$if[$getVar[voiceAction]==left;ED4245;FEE75C]]]',
    '$description[<@$getVar[memberID]> **$getVar[voiceAction]** $if[$getVar[voiceAction]==joined;**$getVar[newChannelName]**;$if[$getVar[voiceAction]==left;**$getVar[oldChannelName]**;**$getVar[oldChannelName]** → **$getVar[newChannelName]**]].]',
    '$addField[👤 Member;$getVar[memberUsername];true]',
    '$addField[⚡ Action;$getVar[voiceAction];true]',
    '$addField[🌐 Server;$getVar[guildName];true]',
    '$footer[Voice state update · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
