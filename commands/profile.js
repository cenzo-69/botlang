module.exports = {
  name:        'profile',
  description: 'Build a profile card using variables, strings, and math',
  code: `
$var[name;     $username]
$var[id;       $userID]
$var[nameLen;  $length[$getVar[name]]]
$var[nameUpper;$upper[$getVar[name]]]
$var[nameLower;$lower[$getVar[name]]]
$var[score;    $math[$random[1;100] * 10]]
$var[rank;     $if[$getVar[score]>=800; S; $if[$getVar[score]>=600; A; $if[$getVar[score]>=400; B; C]]]]
👤 **User Profile**
\`\`\`
Username  : $getVar[nameUpper]
User ID   : $getVar[id]
Name len  : $getVar[nameLen] chars
Lowercase : $getVar[nameLower]
Server    : $guildName
Members   : $memberCount
Score     : $getVar[score]
Rank      : $getVar[rank]
Snapshot  : $time[YYYY-MM-DD HH:mm]
\`\`\`
$if[$getVar[score]>=800; ⭐ Elite member detected!; Keep grinding, **$getVar[name]**!]
  `.trim(),
};
