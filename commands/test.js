module.exports = {
  name: "test",
  code: `
$var[visitKey;visits_$userID]
$db.set[$getVar[visitKey];$add[$db.get[$getVar[visitKey];0];1]]
$var[visits;$db.get[$getVar[visitKey];1]]

$title[🧪 CenzoJS Feature Test]
$titleURL[https://cenzojs.site/]
$color[#5865F2]
$author[$botUsername]
$authorIcon[$botAvatar]
$thumbnail[$userAvatar]
$description[$bold[Hello,] $italic[$displayName]! Here is a live showcase of CenzoJS functions running right now.]

$addField[👤 User Info;$bold[Username:] $username$newline$bold[ID:] $userID$newline$bold[Tag:] $userTag$newline$bold[Is Bot:] $isBot$newline$bold[Account Created:] $userCreated;true]

$addField[🏠 Server Info;$bold[Server:] $guildName$newline$bold[Members:] $numberSeparator[$memberCount]$newline$bold[Roles:] $roleCount$newline$bold[Emojis:] $emojiCount$newline$bold[Boost Level:] $serverBoostLevel;true]

$addField[📡 Bot Info;$bold[Ping:] $ping ms$newline$bold[Channel:] #$channelName$newline$bold[Prefix:] $commandName triggered;true]

$addField[🔢 Math Showcase;$bold[random(1-100):] $random[1;100]$newline$bold[2^10:] $math[2^10]$newline$bold[sqrt(144):] $sqrt[144]$newline$bold[max(3,7,1):] $max[3;7;1]$newline$bold[ceil(4.2):] $ceil[4.2];true]

$addField[🔤 String Showcase;$bold[upper:] $upper[hello world]$newline$bold[titlecase:] $titlecase[the quick fox]$newline$bold[length("CenzoJS"):] $length[CenzoJS]$newline$bold[repeat("ha",3):] $repeat[ha;3;-]$newline$bold[split("a,b,c" at 2):] $split[a,b,c;,;2];true]

$addField[⏰ Time & Date;$bold[Date:] $time[YYYY-MM-DD]$newline$bold[Time:] $time[HH:mm:ss]$newline$bold[Unix:] $time;true]

$addField[🧩 Logic;$bold[and(true,true):] $and[true;true]$newline$bold[or(false,true):] $or[false;true]$newline$bold[not(false):] $not[false]$newline$bold[5>3:] $if[5>3;✅ Yes;❌ No];true]

$addField[💾 Database (per-user);You have run this command $bold[$getVar[visits]] time$if[$getVar[visits]==1;;s]. Data is stored with \`$db.set\` and survives bot restarts.;false]

$addField[🎲 Random & Choose;$bold[Random word:] $randomText[apple;banana;cherry;mango]$newline$bold[Random number (1-6):] $random[1;6]$newline$bold[Random string (8 chars):] $randomString[8];false]

$addField[📋 Formatting;$bold[bold text]$newline$italic[italic text]$newline$spoiler[hidden spoiler]$newline$inlineCode[inline code]$newline$strikethrough[strikethrough];false]

$footer[Requested by $username • $time[YYYY-MM-DD HH:mm]]
$footerIcon[$userAvatar]
$timestamp
`
}
