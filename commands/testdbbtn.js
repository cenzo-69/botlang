'use strict';

module.exports = {
  name:      'testdbbtn',
  type:      'button',
  customID:  'testdbbtn',
  ephemeral: true,

  code: `
$db.set[testdbbtn_$authorID; $authorID]
$title[🗄️ Database Test — Passed!]
$color[57F287]
$description[Your user ID was **written to** and **read from** PostgreSQL successfully.]
$addField[🔑 Key;          \`testdbbtn_$authorID\`;                                              true]
$addField[📥 Value Written; \`$authorID\`;                                                       true]
$addField[📤 Value Read;    \`$db.get[testdbbtn_$authorID]\`;                                    true]
$addField[✅ Match;         $if[$equals[$db.get[testdbbtn_$authorID];$authorID]; Yes — stored correctly!; No — something is wrong]; false]
$footer[PostgreSQL persistence ✓ — data survives bot restarts]
$timestamp
  `,
};
