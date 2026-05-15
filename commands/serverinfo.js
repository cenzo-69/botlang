module.exports = {
  name:        'serverinfo',
  description: 'Show information about the current server',
  code: `
🏠 **Server Information**
\`\`\`
Name     : $guildName
ID       : $guildID
Members  : $memberCount
Channel  : #$channelName ($channelID)
Snapshot : $time[YYYY-MM-DD HH:mm:ss]
\`\`\`
  `.trim(),
};
