module.exports = {
  name: 'test',
  code: `
$var[visitKey; visits_$userID]
$db.set[$getVar[visitKey]; $add[$db.get[$getVar[visitKey];0];1]]
$var[visits; $db.get[$getVar[visitKey];1]]

$title[🧪 CenzoJS Feature Test]
$titleURL[https://cenzojs.site/]
$color[#5865F2]
$author[$botUsername]
$authorIcon[$botAvatar]
$thumbnail[$userAvatar]
$description[Hello, **$displayName**! Here is a live showcase of CenzoJS functions running right now.]

$addField[👤 User Info;
**Username:** $username
**ID:** $userID
**Tag:** $userTag
**Is Bot:** $isBot
**Account Created:** $userCreated;
true]

$addField[🏠 Server Info;
**Server:** $guildName
**Members:** $numberSeparator[$memberCount]
**Roles:** $roleCount
**Emojis:** $emojiCount
**Boost Level:** $serverBoostLevel;
true]

$addField[📡 Bot Info;
**Ping:** $ping ms
**Channel:** #$channelName
**Prefix:** $commandName triggered;
true]

$addField[🔢 Math Showcase;
**random(1-100):** $random[1;100]
**2^10:** $math[2^10]
**sqrt(144):** $sqrt[144]
**max(3,7,1):** $max[3;7;1]
**ceil(4.2):** $ceil[4.2];
true]

$addField[🔤 String Showcase;
**upper:** $upper[hello world]
**titlecase:** $titlecase[the quick fox]
**length("CenzoJS"):** $length[CenzoJS]
**repeat("ha",3):** $repeat[ha;3;-]
**split("a,b,c" at 2):** $split[a,b,c;,;2];
true]

$addField[⏰ Time & Date;
**Date:** $time[YYYY-MM-DD]
**Time:** $time[HH:mm:ss]
**Unix:** $time;
true]

$addField[🧩 Logic;
**and(true,true):** $and[true;true]
**or(false,true):** $or[false;true]
**not(false):** $not[false]
**5>3:** $if[5>3; ✅ Yes; ❌ No];
true]

$addField[💾 Database (per-user); You have run this command **$getVar[visits]** time$if[$getVar[visits]==1;;s]. Data is stored with \`$db.set\` and survives bot restarts.; false]

$addField[🎲 Random & Choose;
**Random word:** $randomText[apple;banana;cherry;mango]
**Random number (1-6):** $random[1;6]
**Random string (8 chars):** $randomString[8];
false]

$addField[📋 Formatting;
**bold text**
*italic text*
||hidden spoiler||
\`inline code\`
~~strikethrough~~;
false]

$footer[Requested by $username • $time[YYYY-MM-DD HH:mm]]
$footerIcon[$userAvatar]
$timestamp
  `,
};
