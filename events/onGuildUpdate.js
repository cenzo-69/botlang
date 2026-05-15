'use strict';

module.exports = {
  name: 'onGuildUpdate',

  code: [
    '$if[$getVar[oldGuildName]==$getVar[newGuildName]]',
    '$stop',
    '$endif',
    '$title[🏠 Server Renamed]',
    '$color[5865F2]',
    '$description[The server name was updated.]',
    '$addField[Before;$getVar[oldGuildName];true]',
    '$addField[After;$getVar[newGuildName];true]',
    '$addField[👥 Member Count;$getVar[memberCount];true]',
    '$footer[Server updated · CenzoJS]',
    '$timestamp',
  ].join('\n'),
};
