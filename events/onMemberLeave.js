'use strict';

module.exports = {
  name: 'onMemberLeave',

  code: [
    '$title[🚪 Member Left]',
    '$color[ED4245]',
    '$description[**$getVar[memberUsername]** has left **$getVar[guildName]**. Goodbye! 👋]',
    '$addField[👤 Username;$getVar[memberUsername];true]',
    '$addField[🏷️ Tag;$getVar[memberTag];true]',
    '$addField[👥 Remaining Members;$getVar[memberCount];true]',
    '$addField[🆔 User ID;`$getVar[memberID]`;false]',
    '$footer[Member left · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
