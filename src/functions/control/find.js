'use strict';

// ─── Documentation database ───────────────────────────────────────────────────
const DOCS = [

  // ── Discord / User ────────────────────────────────────────────────────────
  { name:'username',              cat:'discord',    syntax:'$username',                                    desc:'Username of the message author',                                        ex:'Hi $username!  →  Hi TestUser!' },
  { name:'userid',                cat:'discord',    syntax:'$userID',                                      desc:'User ID of the message author',                                         ex:'$userID  →  123456789' },
  { name:'authorid',              cat:'discord',    syntax:'$authorID',                                    desc:'User ID of the author — alias for $userID',                             ex:'$onlyIf[$authorID==123456789]' },
  { name:'usertag',               cat:'discord',    syntax:'$userTag',                                     desc:'Author display name / tag',                                             ex:'$userTag  →  TestUser' },
  { name:'usermention',           cat:'discord',    syntax:'$userMention[userID?]',                        desc:'Mention string for a user. Defaults to author',                         ex:'$userMention  →  <@123456789>' },
  { name:'useravatar',            cat:'discord',    syntax:'$userAvatar[userID?]',                         desc:'Avatar URL of a user. Defaults to author',                              ex:'$userAvatar[$mentioned[1;true]]' },
  { name:'userbanner',            cat:'discord',    syntax:'$userBanner[userID?]',                         desc:'Banner URL of a user (empty if none)',                                   ex:'$image[$userBanner]' },
  { name:'usercreated',           cat:'discord',    syntax:'$userCreated[userID?]',                        desc:'ISO date the account was created',                                      ex:'$userCreated  →  2021-01-01T00:00:00.000Z' },
  { name:'userjoined',            cat:'discord',    syntax:'$userJoined[userID?]',                         desc:'ISO date the user joined the server',                                   ex:'$userJoined  →  2022-06-01T00:00:00.000Z' },
  { name:'userroles',             cat:'discord',    syntax:'$userRoles[userID?;separator?]',               desc:'Comma-separated list of role IDs the user has',                         ex:'$userRoles  →  r1,r2' },
  { name:'displayname',           cat:'discord',    syntax:'$displayName[userID?]',                        desc:'Guild display name (nickname or username)',                              ex:'$displayName  →  TestUser' },
  { name:'isbot',                 cat:'discord',    syntax:'$isBot[userID?]',                              desc:'Returns "true" if the user is a bot',                                   ex:'$isBot  →  false' },
  { name:'avatar',                cat:'discord',    syntax:'$avatar[userID?]',                             desc:'Avatar URL — defaults to author',                                       ex:'$avatar[$mentioned[1;true]]' },
  { name:'mentioned',             cat:'discord',    syntax:'$mentioned[index?;fallback?]',                 desc:'User ID of the nth mention. fallback=true → author ID',                 ex:'$mentioned[1;true]  →  123456789' },

  // ── Discord / Server ──────────────────────────────────────────────────────
  { name:'guildid',               cat:'discord',    syntax:'$guildID',                                     desc:'ID of the current server',                                              ex:'$guildID  →  987654321' },
  { name:'guildname',             cat:'discord',    syntax:'$guildName',                                   desc:'Name of the current server',                                            ex:'Server: $guildName' },
  { name:'serverid',              cat:'discord',    syntax:'$serverID',                                    desc:'Alias for $guildID',                                                    ex:'$serverID  →  987654321' },
  { name:'servername',            cat:'discord',    syntax:'$serverName',                                  desc:'Alias for $guildName',                                                  ex:'$serverName  →  My Server' },
  { name:'servericon',            cat:'discord',    syntax:'$serverIcon',                                  desc:'Server icon URL (empty if none)',                                        ex:'$thumbnail[$serverIcon]' },
  { name:'serverbanner',          cat:'discord',    syntax:'$serverBanner',                                desc:'Server banner URL (empty if none)',                                      ex:'$image[$serverBanner]' },
  { name:'serverownerid',         cat:'discord',    syntax:'$serverOwnerID',                               desc:'User ID of the server owner',                                           ex:'Owner: <@$serverOwnerID>' },
  { name:'servercreated',         cat:'discord',    syntax:'$serverCreated',                               desc:'ISO date the server was created',                                       ex:'$serverCreated  →  2020-01-01T00:00:00.000Z' },
  { name:'serverboostcount',      cat:'discord',    syntax:'$serverBoostCount',                            desc:'Number of Nitro boosts the server has',                                 ex:'Boosts: $serverBoostCount' },
  { name:'serverboostlevel',      cat:'discord',    syntax:'$serverBoostLevel',                            desc:'Server boost tier (0–3)',                                               ex:'Tier: $serverBoostLevel' },
  { name:'servervanity',          cat:'discord',    syntax:'$serverVanity',                                desc:'Vanity invite code (empty if none)',                                     ex:'discord.gg/$serverVanity' },
  { name:'serververificationlevel', cat:'discord',  syntax:'$serverVerificationLevel',                     desc:'Verification level (0 = none, 4 = highest)',                            ex:'$serverVerificationLevel  →  2' },
  { name:'membercount',           cat:'discord',    syntax:'$memberCount',                                 desc:'Total members (bots + humans)',                                          ex:'Members: $memberCount' },
  { name:'humancount',            cat:'discord',    syntax:'$humanCount',                                  desc:'Non-bot member count',                                                  ex:'Humans: $humanCount' },
  { name:'botcount',              cat:'discord',    syntax:'$botCount',                                    desc:'Bot member count',                                                      ex:'Bots: $botCount' },
  { name:'rolecount',             cat:'discord',    syntax:'$roleCount',                                   desc:'Number of roles (includes @everyone)',                                   ex:'Roles: $roleCount' },
  { name:'emojicount',            cat:'discord',    syntax:'$emojiCount',                                  desc:'Number of custom emojis in the server',                                 ex:'Emojis: $emojiCount' },
  { name:'allmemberids',          cat:'discord',    syntax:'$allMemberIDs[separator?]',                    desc:'All member IDs joined by separator',                                    ex:'$allMemberIDs[, ]' },

  // ── Discord / Channel & Bot ───────────────────────────────────────────────
  { name:'channelid',             cat:'discord',    syntax:'$channelID',                                   desc:'ID of the current channel',                                             ex:'$channelID  →  111222333' },
  { name:'channelname',           cat:'discord',    syntax:'$channelName',                                 desc:'Name of the current channel',                                           ex:'You are in #$channelName' },
  { name:'channeltopic',          cat:'discord',    syntax:'$channelTopic',                                desc:'Topic of the current channel',                                          ex:'Topic: $channelTopic' },
  { name:'ping',                  cat:'discord',    syntax:'$ping',                                        desc:'Bot WebSocket latency in ms',                                           ex:'Ping: $ping ms' },
  { name:'botid',                 cat:'discord',    syntax:'$botID',                                       desc:'The bot\'s Discord user ID',                                            ex:'$botID  →  999000999' },
  { name:'botusername',           cat:'discord',    syntax:'$botUsername',                                 desc:'The bot\'s username',                                                   ex:'Powered by $botUsername' },
  { name:'botavatar',             cat:'discord',    syntax:'$botAvatar',                                   desc:'The bot\'s avatar URL',                                                 ex:'$thumbnail[$botAvatar]' },

  // ── Message Parsing ───────────────────────────────────────────────────────
  { name:'message',               cat:'message',    syntax:'$message  /  $message[n]',                    desc:'Full input after the command, or the nth word (1-based)',               ex:'!say hi world → $message[1] = hi' },
  { name:'nomentionmessage',      cat:'message',    syntax:'$noMentionMessage[n?]',                        desc:'Command input with all Discord mentions stripped',                      ex:'!say @x hi → $noMentionMessage = hi' },
  { name:'argscount',             cat:'message',    syntax:'$argsCount',                                   desc:'Number of space-separated words in the command input',                  ex:'!cmd a b c → $argsCount = 3' },
  { name:'arg',                   cat:'message',    syntax:'$arg[n]',                                      desc:'Nth word of input — alias for $message[n]',                            ex:'$arg[2]  →  second word' },
  { name:'commandname',           cat:'message',    syntax:'$commandName',                                 desc:'The triggered command name without prefix',                             ex:'!ping → $commandName = ping' },
  { name:'sendmessage',           cat:'message',    syntax:'$sendMessage[content;channelID?]',             desc:'Send a message to the current (or specified) channel',                  ex:'$sendMessage[Hello!]' },
  { name:'reply',                 cat:'message',    syntax:'$reply[content]',                              desc:'Reply to the triggering message',                                       ex:'$reply[Done!]' },
  { name:'deletemessage',         cat:'message',    syntax:'$deleteMessage[delayMs?]',                     desc:'Delete the triggering message after optional delay',                    ex:'$deleteMessage[2000]' },
  { name:'channelsendmessage',    cat:'message',    syntax:'$channelSendMessage[channelID;content]',       desc:'Send a message to any channel by ID',                                   ex:'$channelSendMessage[123456;Hello!]' },

  // ── Moderation ────────────────────────────────────────────────────────────
  { name:'ban',                   cat:'moderation', syntax:'$ban[userID;reason?]',                         desc:'Ban a user from the guild',                                             ex:'$ban[$mentioned[1;true];Breaking rules]' },
  { name:'kick',                  cat:'moderation', syntax:'$kick[userID;reason?]',                        desc:'Kick a member from the guild',                                          ex:'$kick[$mentioned[1;true]]' },
  { name:'timeout',               cat:'moderation', syntax:'$timeout[userID;durationMs;reason?]',          desc:'Timeout (mute) a member for a duration in milliseconds',                ex:'$timeout[$mentioned[1;true];300000]' },
  { name:'untimeout',             cat:'moderation', syntax:'$untimeout[userID]',                           desc:'Remove a timeout from a member',                                        ex:'$untimeout[$mentioned[1;true]]' },
  { name:'purge',                 cat:'moderation', syntax:'$purge[amount]',                               desc:'Bulk-delete up to 100 messages in the current channel',                 ex:'$purge[10]' },

  // ── Roles ─────────────────────────────────────────────────────────────────
  { name:'hasrole',               cat:'roles',      syntax:'$hasRole[userID;roleID]',                      desc:'Returns "true" if the user has the role',                               ex:'$hasRole[$userID;123]  →  true' },
  { name:'addrole',               cat:'roles',      syntax:'$addRole[userID;roleID]',                      desc:'Add a role to a guild member',                                          ex:'$addRole[$mentioned[1;true];roleID]' },
  { name:'removerole',            cat:'roles',      syntax:'$removeRole[userID;roleID]',                   desc:'Remove a role from a guild member',                                     ex:'$removeRole[$mentioned[1;true];roleID]' },
  { name:'createrole',            cat:'roles',      syntax:'$createRole[name;color?;hoist?;mentionable?]', desc:'Create a new role in the guild. Returns new role ID',                   ex:'$createRole[Newbie;#ff0000]' },
  { name:'deleterole',            cat:'roles',      syntax:'$deleteRole[roleID]',                          desc:'Delete a role from the guild',                                          ex:'$deleteRole[123456789]' },

  // ── Channels ──────────────────────────────────────────────────────────────
  { name:'createchannel',         cat:'channels',   syntax:'$createChannel[name;type?]',                   desc:'Create a channel. type: text|voice|category|forum|stage|announcement. Returns new channel ID', ex:'$createChannel[general]' },
  { name:'deletechannel',         cat:'channels',   syntax:'$deleteChannel[channelID]',                    desc:'Delete a channel by ID',                                                ex:'$deleteChannel[$channelID]' },
  { name:'setchannelname',        cat:'channels',   syntax:'$setChannelName[channelID;name]',               desc:'Rename a channel',                                                      ex:'$setChannelName[$channelID;new-name]' },
  { name:'slowmode',              cat:'channels',   syntax:'$slowmode[seconds;channelID?]',                 desc:'Set slowmode on a channel (0 to disable)',                              ex:'$slowmode[5]' },

  // ── Variables (session) ───────────────────────────────────────────────────
  { name:'var',                   cat:'variables',  syntax:'$var[name;value]',                             desc:'Set a session variable. Resets each command run',                       ex:'$var[score;10]$getVar[score]  →  10' },
  { name:'setvar',                cat:'variables',  syntax:'$setVar[name;value]',                          desc:'Explicit alias for $var',                                               ex:'$setVar[hp;100]' },
  { name:'getvar',                cat:'variables',  syntax:'$getVar[name;default?]',                       desc:'Read a session variable. Returns default if not set',                   ex:'$getVar[score;0]  →  10' },
  { name:'deletevar',             cat:'variables',  syntax:'$deleteVar[name]',                             desc:'Remove a session variable',                                             ex:'$deleteVar[score]' },
  { name:'varexists',             cat:'variables',  syntax:'$varExists[name]',                             desc:'Returns "true" if the session variable is set',                         ex:'$varExists[score]  →  true' },
  { name:'listvar',               cat:'variables',  syntax:'$listVar[separator?]',                         desc:'Returns all current session variable names joined by separator',        ex:'$listVar[, ]  →  score, hp' },
  { name:'setuservar',            cat:'variables',  syntax:'$setUserVar[name;value;userID?]',              desc:'Set a persistent (in-memory) variable scoped to a user',                ex:'$setUserVar[coins;100]' },
  { name:'getuservar',            cat:'variables',  syntax:'$getUserVar[name;userID?;default?]',           desc:'Get a user-scoped variable',                                            ex:'$getUserVar[coins;0]  →  100' },
  { name:'resetuservar',          cat:'variables',  syntax:'$resetUserVar[name;userID?]',                  desc:'Delete a user-scoped variable',                                         ex:'$resetUserVar[coins]' },
  { name:'setservervar',          cat:'variables',  syntax:'$setServerVar[name;value;guildID?]',           desc:'Set a persistent variable scoped to a guild',                           ex:'$setServerVar[prefix;!]' },
  { name:'getservervar',          cat:'variables',  syntax:'$getServerVar[name;guildID?;default?]',        desc:'Get a guild-scoped variable',                                           ex:'$getServerVar[prefix;!]' },
  { name:'resetservervar',        cat:'variables',  syntax:'$resetServerVar[name;guildID?]',               desc:'Delete a guild-scoped variable',                                        ex:'$resetServerVar[prefix]' },
  { name:'setchannelvar',         cat:'variables',  syntax:'$setChannelVar[name;value;channelID?]',        desc:'Set a persistent variable scoped to a channel',                         ex:'$setChannelVar[topic;hello]' },
  { name:'getchannelvar',         cat:'variables',  syntax:'$getChannelVar[name;channelID?;default?]',     desc:'Get a channel-scoped variable',                                         ex:'$getChannelVar[topic]  →  hello' },
  { name:'resetchannelvar',       cat:'variables',  syntax:'$resetChannelVar[name;channelID?]',            desc:'Delete a channel-scoped variable',                                      ex:'$resetChannelVar[topic]' },

  // ── Database ──────────────────────────────────────────────────────────────
  { name:'db.set',                cat:'database',   syntax:'$db.set[key;value]',                           desc:'Persist a value to disk under key (survives restarts)',                 ex:'$db.set[coins_123;500]' },
  { name:'db.get',                cat:'database',   syntax:'$db.get[key;default?]',                        desc:'Read a persisted value; returns default if key missing',                ex:'$db.get[coins_123;0]  →  500' },
  { name:'db.delete',             cat:'database',   syntax:'$db.delete[key]',                              desc:'Remove a key from persistent storage',                                  ex:'$db.delete[coins_123]' },
  { name:'db.has',                cat:'database',   syntax:'$db.has[key]',                                 desc:'Returns "true" if key exists in persistent storage',                    ex:'$db.has[coins_123]  →  true' },

  // ── Control Flow ──────────────────────────────────────────────────────────
  { name:'if',                    cat:'control',    syntax:'$if[condition;then;else?]',                    desc:'Run then or else branch — only the matched branch runs',                ex:'$if[5>3;YES;NO]  →  YES' },
  { name:'elseif',                cat:'control',    syntax:'$elseif[condition;then]',                      desc:'Chained condition after $if. Used with block-style $if',                ex:'$if[$x==1;A]$elseif[$x==2;B]$else[C]$endif' },
  { name:'else',                  cat:'control',    syntax:'$else[code]',                                  desc:'Fallback branch for block-style $if',                                   ex:'$if[false;YES]$else[NO]$endif  →  NO' },
  { name:'endif',                 cat:'control',    syntax:'$endif',                                       desc:'Closes a block-style $if/$elseif/$else block',                          ex:'$if[true;OK]$endif' },
  { name:'onlyif',                cat:'control',    syntax:'$onlyIf[condition;errorMsg?]',                 desc:'Halt execution if condition is false. Shows errorMsg if set',           ex:'$onlyIf[$argsCount>=1;Provide a name!]' },
  { name:'onlychannels',          cat:'control',    syntax:'$onlyChannels[id1;id2;...;errorMsg?]',         desc:'Stop execution unless the command is used in one of the listed channels', ex:'$onlyChannels[111;222;Bot channels only!]' },
  { name:'onlyusers',             cat:'control',    syntax:'$onlyUsers[id1;id2;...;errorMsg?]',            desc:'Restrict command to specific user IDs',                                 ex:'$onlyUsers[123456789;Owner only!]' },
  { name:'onlyroles',             cat:'control',    syntax:'$onlyRoles[id1;id2;...;errorMsg?]',            desc:'Restrict command to users who have at least one of the listed roles',   ex:'$onlyRoles[roleID;Need mod role!]' },
  { name:'onlyperms',             cat:'control',    syntax:'$onlyPerms[perm1;perm2;...;errorMsg?]',        desc:'Restrict command to users with specific Discord permissions',            ex:'$onlyPerms[Administrator;Admins only!]' },
  { name:'equals',                cat:'control',    syntax:'$equals[a;b;then?;else?]',                     desc:'String equality — returns true/false or branches',                      ex:'$equals[hi;hi;match;no]  →  match' },
  { name:'loop',                  cat:'control',    syntax:'$loop[count;body]',                            desc:'Repeat body N times (max 1000)',                                        ex:'$loop[3;Item $loopNumber\n]' },
  { name:'loopindex',             cat:'control',    syntax:'$loopIndex',                                   desc:'Current loop iteration — 0-based',                                      ex:'$loop[3;[$loopIndex]]  →  [0][1][2]' },
  { name:'loopnumber',            cat:'control',    syntax:'$loopNumber',                                  desc:'Current loop iteration — 1-based',                                      ex:'$loop[3;$loopNumber. ]  →  1. 2. 3.' },
  { name:'stop',                  cat:'control',    syntax:'$stop',                                        desc:'Immediately halt execution',                                            ex:'hi$stop never runs  →  hi' },
  { name:'find',                  cat:'control',    syntax:'$find[query?]',                                desc:'Search function docs. No query = category overview',                    ex:'$find[math]  /  $find[$upper]' },

  // ── Logic ─────────────────────────────────────────────────────────────────
  { name:'and',                   cat:'logic',      syntax:'$and[v1;v2;...]',                              desc:'Returns "true" only if ALL values are truthy',                          ex:'$and[true;true]  →  true' },
  { name:'or',                    cat:'logic',      syntax:'$or[v1;v2;...]',                               desc:'Returns "true" if ANY value is truthy',                                 ex:'$or[false;true]  →  true' },
  { name:'not',                   cat:'logic',      syntax:'$not[value]',                                  desc:'Inverts a boolean — true→false, false→true',                            ex:'$not[$equals[a;b]]  →  true' },

  // ── Math ──────────────────────────────────────────────────────────────────
  { name:'math',                  cat:'math',       syntax:'$math[expression]',                            desc:'Safe arithmetic: + − * / % ^ () with correct precedence',              ex:'$math[(2+3)*4^2]  →  80' },
  { name:'random',                cat:'math',       syntax:'$random[min;max]  /  $random[max]',            desc:'Random integer between min and max (inclusive)',                        ex:'$random[1;6]  →  4' },
  { name:'add',                   cat:'math',       syntax:'$add[a;b;c;...]',                              desc:'Sum all provided numbers',                                              ex:'$add[10;20;5]  →  35' },
  { name:'sub',                   cat:'math',       syntax:'$sub[a;b;c;...]',                              desc:'Subtract b, c… from a',                                                ex:'$sub[100;30;20]  →  50' },
  { name:'multi',                 cat:'math',       syntax:'$multi[a;b;c;...]',                            desc:'Multiply all provided numbers',                                         ex:'$multi[3;4;2]  →  24' },
  { name:'div',                   cat:'math',       syntax:'$div[a;b]',                                    desc:'Divide a by b',                                                         ex:'$div[10;4]  →  2.5' },
  { name:'mod',                   cat:'math',       syntax:'$mod[a;b]',                                    desc:'Remainder of a divided by b',                                           ex:'$mod[17;5]  →  2' },
  { name:'modulo',                cat:'math',       syntax:'$modulo[a;b]',                                 desc:'Alias for $mod',                                                        ex:'$modulo[17;5]  →  2' },
  { name:'ceil',                  cat:'math',       syntax:'$ceil[number]',                                desc:'Round up to the nearest integer',                                       ex:'$ceil[4.1]  →  5' },
  { name:'floor',                 cat:'math',       syntax:'$floor[number]',                               desc:'Round down to the nearest integer',                                     ex:'$floor[4.9]  →  4' },
  { name:'sqrt',                  cat:'math',       syntax:'$sqrt[number]',                                desc:'Square root of a number',                                               ex:'$sqrt[144]  →  12' },
  { name:'max',                   cat:'math',       syntax:'$max[a;b;c;...]',                              desc:'Return the largest number',                                             ex:'$max[3;7;2;9]  →  9' },
  { name:'min',                   cat:'math',       syntax:'$min[a;b;c;...]',                              desc:'Return the smallest number',                                            ex:'$min[3;7;2;9]  →  2' },
  { name:'calculate',             cat:'math',       syntax:'$calculate[expression]',                       desc:'Alias for $math — evaluate a math expression',                          ex:'$calculate[2*(3+4)]  →  14' },
  { name:'sort',                  cat:'math',       syntax:'$sort[a;b;c;...;asc|desc?]',                   desc:'Sort numbers (or strings) and return comma-separated result',           ex:'$sort[5;2;8;1]  →  1,2,5,8' },

  // ── Strings ───────────────────────────────────────────────────────────────
  { name:'upper',                 cat:'strings',    syntax:'$upper[text]',                                 desc:'Convert text to UPPERCASE',                                             ex:'$upper[hello]  →  HELLO' },
  { name:'lower',                 cat:'strings',    syntax:'$lower[text]',                                 desc:'Convert text to lowercase',                                             ex:'$lower[HELLO]  →  hello' },
  { name:'uppercase',             cat:'strings',    syntax:'$uppercase[text]',                             desc:'Alias for $upper',                                                      ex:'$uppercase[hello]  →  HELLO' },
  { name:'lowercase',             cat:'strings',    syntax:'$lowercase[text]',                             desc:'Alias for $lower',                                                      ex:'$lowercase[HELLO]  →  hello' },
  { name:'titlecase',             cat:'strings',    syntax:'$titlecase[text]',                             desc:'Capitalise the first letter of each word',                              ex:'$titlecase[hello world]  →  Hello World' },
  { name:'length',                cat:'strings',    syntax:'$length[text]',                                desc:'Number of characters in text',                                          ex:'$length[hello]  →  5' },
  { name:'charcount',             cat:'strings',    syntax:'$charCount[text]',                             desc:'Alias for $length',                                                     ex:'$charCount[hello]  →  5' },
  { name:'linescount',            cat:'strings',    syntax:'$linesCount[text]',                            desc:'Number of newline-separated lines in text',                             ex:'$linesCount[a\nb\nc]  →  3' },
  { name:'trim',                  cat:'strings',    syntax:'$trim[text]',                                  desc:'Strip leading and trailing whitespace',                                  ex:'$trim[  hi  ]  →  hi' },
  { name:'trimcontent',           cat:'strings',    syntax:'$trimContent[text]',                           desc:'Alias for $trim',                                                       ex:'$trimContent[  hi  ]  →  hi' },
  { name:'trimspace',             cat:'strings',    syntax:'$trimSpace[text]',                             desc:'Collapse all whitespace runs to a single space and trim',               ex:'$trimSpace[a  b   c]  →  a b c' },
  { name:'replace',               cat:'strings',    syntax:'$replace[text;search;replacement]',            desc:'Replace all occurrences of search in text',                             ex:'$replace[hi world;world;there]  →  hi there' },
  { name:'replacetext',           cat:'strings',    syntax:'$replaceText[text;search;replacement]',        desc:'Alias for $replace',                                                    ex:'$replaceText[a b a;a;x]  →  x b x' },
  { name:'includes',              cat:'strings',    syntax:'$includes[text;search]',                       desc:'Returns "true" if text contains the search string',                     ex:'$includes[hello;ell]  →  true' },
  { name:'slice',                 cat:'strings',    syntax:'$slice[text;start;end?]',                      desc:'Extract a substring by 0-based character index',                        ex:'$slice[hello;1;4]  →  ell' },
  { name:'croptext',              cat:'strings',    syntax:'$cropText[text;maxLength;suffix?]',            desc:'Truncate text to maxLength, appending suffix if truncated',             ex:'$cropText[Hello World;5]  →  Hello...' },
  { name:'split',                 cat:'strings',    syntax:'$split[text;sep;index?]',                      desc:'Split by separator. No index = count, index = that element',           ex:'$split[a,b,c;,;2]  →  b' },
  { name:'repeat',                cat:'strings',    syntax:'$repeat[text;n;sep?]',                         desc:'Repeat text n times with an optional separator',                        ex:'$repeat[ha;3;-]  →  ha-ha-ha' },
  { name:'newline',               cat:'strings',    syntax:'$newline',                                     desc:'Insert a literal newline character',                                    ex:'line1$newlineline2' },
  { name:'space',                 cat:'strings',    syntax:'$space[n?]',                                   desc:'Insert n spaces (default 1)',                                           ex:'a$space[3]b  →  a   b' },
  { name:'numberseparator',       cat:'strings',    syntax:'$numberSeparator[number;sep?]',                desc:'Format a number with thousands separators',                             ex:'$numberSeparator[1000000]  →  1,000,000' },

  // ── Embeds ────────────────────────────────────────────────────────────────
  { name:'title',                 cat:'embeds',     syntax:'$title[text]',                                 desc:'Set the embed title',                                                   ex:'$title[Server Stats]' },
  { name:'titleurl',              cat:'embeds',     syntax:'$titleURL[url]',                               desc:'Make the embed title a clickable hyperlink',                            ex:'$titleURL[https://example.com]' },
  { name:'description',           cat:'embeds',     syntax:'$description[text]',                           desc:'Set the embed description (main body)',                                 ex:'$description[Welcome to $guildName!]' },
  { name:'color',                 cat:'embeds',     syntax:'$color[#hex]',                                 desc:'Set the embed accent color',                                            ex:'$color[#5865F2]' },
  { name:'footer',                cat:'embeds',     syntax:'$footer[text]',                                desc:'Set the embed footer text',                                             ex:'$footer[Requested by $username]' },
  { name:'footericon',            cat:'embeds',     syntax:'$footerIcon[url]',                             desc:'Set the embed footer icon URL',                                         ex:'$footerIcon[$avatar]' },
  { name:'author',                cat:'embeds',     syntax:'$author[name]',                                desc:'Set the embed author name (shown above title)',                         ex:'$author[$botUsername]' },
  { name:'authoricon',            cat:'embeds',     syntax:'$authorIcon[url]',                             desc:'Set the embed author icon URL',                                         ex:'$authorIcon[$botAvatar]' },
  { name:'authorurl',             cat:'embeds',     syntax:'$authorURL[url]',                              desc:'Make the embed author name a clickable link',                           ex:'$authorURL[https://example.com]' },
  { name:'thumbnail',             cat:'embeds',     syntax:'$thumbnail[url]',                              desc:'Set the small image at the top-right of the embed',                    ex:'$thumbnail[$serverIcon]' },
  { name:'image',                 cat:'embeds',     syntax:'$image[url]',                                  desc:'Set the large image at the bottom of the embed',                       ex:'$image[$serverBanner]' },
  { name:'timestamp',             cat:'embeds',     syntax:'$timestamp',                                   desc:'Add current date/time to the embed footer',                             ex:'$timestamp' },
  { name:'addfield',              cat:'embeds',     syntax:'$addField[name;value;inline?]',                desc:'Add a field to the embed. inline=true for side-by-side fields',        ex:'$addField[Score;$db.get[score;0];true]' },
  { name:'sendembed',             cat:'embeds',     syntax:'$sendEmbed[channelID]',                        desc:'Send the currently built embed to a channel. Returns message ID',       ex:'$title[Hi]$sendEmbed[$channelID]' },
  { name:'sendembedmessage',      cat:'embeds',     syntax:'$sendEmbedMessage[channelID;content;title;titleURL;desc;color;author;authorIcon;footer;footerIcon;thumb;image;timestamp?;returnID?]', desc:'All-in-one embed sender. Pass empty strings to skip fields', ex:'$sendEmbedMessage[$channelID;;My Title]' },

  // ── Components ────────────────────────────────────────────────────────────
  { name:'button',                cat:'components', syntax:'$button[label;customID;style?;emoji?;disabled?]', desc:'Add a button to the message. style: primary|secondary|success|danger|link', ex:'$button[Click me!;btn_click;primary]' },
  { name:'selectmenu',            cat:'components', syntax:'$selectMenu[customID;placeholder;opt1;opt2;...]',  desc:'Add a select/dropdown menu to the message',                         ex:'$selectMenu[pick;Choose one;Option A;Option B]' },
  { name:'modal',                 cat:'components', syntax:'$modal[title;customID]',                       desc:'Open a modal dialog (interaction context only)',                        ex:'$modal[Feedback Form;feedback]' },
  { name:'textinput',             cat:'components', syntax:'$textInput[label;customID;style?;placeholder?;required?]', desc:'Add a text input to a modal',                              ex:'$textInput[Your name;name_input;short]' },

  // ── Time ──────────────────────────────────────────────────────────────────
  { name:'time',                  cat:'time',       syntax:'$time  /  $time[format]',                      desc:'Unix timestamp, or formatted date. Tokens: YYYY MM DD HH mm ss',       ex:'$time[YYYY-MM-DD]  →  2026-05-11' },
  { name:'date',                  cat:'time',       syntax:'$date  /  $date[format]',                      desc:'Current date as YYYY-MM-DD or using custom tokens',                    ex:'$date  →  2026-05-11' },
  { name:'day',                   cat:'time',       syntax:'$day',                                         desc:'Current day of the month (1–31)',                                       ex:'$day  →  11' },
  { name:'month',                 cat:'time',       syntax:'$month',                                       desc:'Current month number (1–12)',                                           ex:'$month  →  5' },
  { name:'year',                  cat:'time',       syntax:'$year',                                        desc:'Current 4-digit year',                                                  ex:'$year  →  2026' },
  { name:'hour',                  cat:'time',       syntax:'$hour',                                        desc:'Current hour (0–23)',                                                   ex:'$hour  →  14' },
  { name:'minute',                cat:'time',       syntax:'$minute',                                      desc:'Current minute (0–59)',                                                 ex:'$minute  →  30' },
  { name:'second',                cat:'time',       syntax:'$second',                                      desc:'Current second (0–59)',                                                 ex:'$second  →  45' },

  // ── Cooldowns ─────────────────────────────────────────────────────────────
  { name:'cooldown',              cat:'cooldown',   syntax:'$cooldown[duration]',                          desc:'Per-user cooldown. Format: 10s | 5m | 2h | 1d',                        ex:'$cooldown[30s]' },
  { name:'globalcooldown',        cat:'cooldown',   syntax:'$globalCooldown[duration]',                    desc:'Global cooldown — all users share one slot per command',                ex:'$globalCooldown[5m]' },
  { name:'servercooldown',        cat:'cooldown',   syntax:'$serverCooldown[duration]',                    desc:'Per-server cooldown — all users in this guild share one slot',         ex:'$serverCooldown[1m]' },
  { name:'getcooldown',           cat:'cooldown',   syntax:'$getCooldown[type?;id?]',                      desc:'Returns remaining cooldown seconds. type: user|global|server',         ex:'$getCooldown  →  25.0' },
  { name:'changecooldowntime',    cat:'cooldown',   syntax:'$changeCooldownTime[duration;type?;id?]',      desc:'Change (or clear with "0") the active cooldown time',                  ex:'$changeCooldownTime[0]' },

  // ── Reactions ─────────────────────────────────────────────────────────────
  { name:'addreaction',           cat:'reactions',  syntax:'$addReaction[emoji;messageID?;channelID?]',    desc:'React to a message with an emoji',                                     ex:'$addReaction[👍]' },
  { name:'addreactions',          cat:'reactions',  syntax:'$addReactions[emoji1;emoji2;...;messageID?]',  desc:'Add multiple reactions to a message',                                  ex:'$addReactions[👍;❤️;🎉]' },
  { name:'addcmdreactions',       cat:'reactions',  syntax:'$addCmdReactions[emoji1;emoji2;...]',          desc:'Add reactions to the triggering command message',                       ex:'$addCmdReactions[✅;❌]' },
  { name:'getreactions',          cat:'reactions',  syntax:'$getReactions[emoji;messageID?;channelID?]',   desc:'Returns the count of a specific reaction on a message',                ex:'$getReactions[👍]  →  5' },
  { name:'clearreactions',        cat:'reactions',  syntax:'$clearReactions[messageID?;channelID?]',       desc:'Remove ALL reactions from a message',                                  ex:'$clearReactions' },
  { name:'userreacted',           cat:'reactions',  syntax:'$userReacted[emoji;userID?;messageID?;channelID?]', desc:'Returns "true" if the user reacted with the emoji',              ex:'$userReacted[👍]  →  true' },

  // ── Emojis ────────────────────────────────────────────────────────────────
  { name:'addemoji',              cat:'emojis',     syntax:'$addEmoji[name;imageURL;guildID?]',            desc:'Upload a new custom emoji. Returns emoji string',                      ex:'$addEmoji[myEmoji;https://...]' },
  { name:'removeemoji',           cat:'emojis',     syntax:'$removeEmoji[emojiID;guildID?]',               desc:'Delete a custom emoji from the guild',                                 ex:'$removeEmoji[123456789]' },
  { name:'customemoji',           cat:'emojis',     syntax:'$customEmoji[name;guildID?]',                  desc:'Returns the formatted emoji string by name',                           ex:'$customEmoji[wave]  →  <:wave:123>' },
  { name:'emojiexists',           cat:'emojis',     syntax:'$emojiExists[name;guildID?]',                  desc:'Returns "true" if an emoji with that name exists',                     ex:'$emojiExists[wave]  →  true' },
  { name:'emojiname',             cat:'emojis',     syntax:'$emojiName[emojiID;guildID?]',                 desc:'Returns the name of a custom emoji by ID',                             ex:'$emojiName[123456789]  →  wave' },
  { name:'emojicount',            cat:'emojis',     syntax:'$emojiCount',                                  desc:'Number of custom emojis in the server',                                ex:'$emojiCount  →  42' },
  { name:'emotecount',            cat:'emojis',     syntax:'$emoteCount[guildID?]',                        desc:'Alias for $emojiCount',                                                ex:'$emoteCount  →  42' },
  { name:'isemojianimated',       cat:'emojis',     syntax:'$isEmojiAnimated[emojiID;guildID?]',           desc:'Returns "true" if the emoji is animated (GIF)',                        ex:'$isEmojiAnimated[123456789]  →  false' },

  // ── Random ────────────────────────────────────────────────────────────────
  { name:'randomtext',            cat:'random',     syntax:'$randomText[opt1;opt2;...]',                   desc:'Return one of the provided options at random',                         ex:'$randomText[heads;tails]  →  heads' },
  { name:'choose',                cat:'random',     syntax:'$choose[opt1;opt2;...]',                       desc:'Alias for $randomText',                                                ex:'$choose[rock;paper;scissors]' },
  { name:'randomstring',          cat:'random',     syntax:'$randomString[length;chars?]',                 desc:'Generate a random alphanumeric string of given length',                ex:'$randomString[8]  →  aB3xZ9kL' },
  { name:'randomuser',            cat:'random',     syntax:'$randomUser',                                  desc:'Returns a random guild member\'s username',                             ex:'$randomUser  →  SomeUser' },
  { name:'randomuserid',          cat:'random',     syntax:'$randomUserID',                                desc:'Returns a random guild member\'s user ID',                              ex:'<@$randomUserID>' },
  { name:'randommemberid',        cat:'random',     syntax:'$randomMemberID',                              desc:'Random member ID from the cached member list',                         ex:'Chosen: <@$randomMemberID>' },
  { name:'randomchannelid',       cat:'random',     syntax:'$randomChannelID',                             desc:'Random channel ID from the cached channel list',                       ex:'Go to <#$randomChannelID>' },
  { name:'randomroleid',          cat:'random',     syntax:'$randomRoleID',                                desc:'Random role ID from the cached role list',                              ex:'Role: <@&$randomRoleID>' },
  { name:'randomguildid',         cat:'random',     syntax:'$randomGuildID[any?]',                         desc:'Current guild ID, or a random guild from the bot\'s cache with "any"', ex:'$randomGuildID[any]' },
  { name:'randommention',         cat:'random',     syntax:'$randomMention',                               desc:'Mentions a random guild member',                                       ex:'$randomMention won the prize!' },
  { name:'randomcategoryid',      cat:'random',     syntax:'$randomCategoryID',                            desc:'Returns the ID of a random category channel',                          ex:'<#$randomCategoryID>' },

  // ── Misc ──────────────────────────────────────────────────────────────────
  { name:'eval',                  cat:'misc',       syntax:'$eval[code]',                                  desc:'Re-run code as framework syntax — NOT JavaScript',                     ex:'$eval[$message]  →  executes user input' },
  { name:'evaldjs',               cat:'misc',       syntax:'$evalDJS[code]',                               desc:'JS eval with full discord.js access — disabled by default',            ex:'See src/dev/evalDJS.js' },
  { name:'raw',                   cat:'misc',       syntax:'$raw[code]',                                   desc:'Return the source text of code WITHOUT evaluating $functions',         ex:'$raw[$username]  →  $username (literal)' },
  { name:'escape',                cat:'misc',       syntax:'$escape[text]',                                desc:'Escape $ and ; so they are safe to pass into $eval',                   ex:'$escape[$username]  →  \\$username' },
  { name:'comment',               cat:'misc',       syntax:'$comment[...text...]',                         desc:'A comment — always returns empty string, content is ignored',          ex:'$comment[TODO: add more logic]  →  ' },
  { name:'jsonparse',             cat:'misc',       syntax:'$jsonParse[json;key?]',                        desc:'Parse JSON. key uses dot-path notation',                               ex:'$jsonParse[{"name":"Bob"};name]  →  Bob' },
  { name:'jsonstringify',         cat:'misc',       syntax:'$jsonStringify[k1;v1;k2;v2;...]',              desc:'Build a JSON object from alternating key-value pairs',                 ex:'$jsonStringify[x;1;y;2]  →  {"x":"1","y":"2"}' },
  { name:'jsonget',               cat:'misc',       syntax:'$jsonGet[json;path]',                          desc:'Get a nested value from a JSON string using dot-path notation',        ex:'$jsonGet[{"user":{"name":"Alice"}};user.name]  →  Alice' },
  { name:'jsonset',               cat:'misc',       syntax:'$jsonSet[json;path;value]',                    desc:'Set a nested value in a JSON string and return updated JSON',          ex:'$jsonSet[{"x":1};x;99]  →  {"x":"99"}' },

  // ── Control — loops ───────────────────────────────────────────────────────
  { name:'while',                 cat:'control',    syntax:'$while[condition;body]',                       desc:'Repeat body while condition is truthy (max 1000 iterations)',          ex:'$var[i;0]$while[$getVar[i]<5;$var[i;$math[$getVar[i]+1]]]' },
  { name:'foreach',               cat:'control',    syntax:'$forEach[items;separator;body]',               desc:'Loop over a delimited list. Body is lazy, repeats once per item',     ex:'$forEach[a,b,c;,;Item: $forEachValue\n]' },
  { name:'foreachvalue',          cat:'control',    syntax:'$forEachValue',                                desc:'Current element value inside a $forEach body',                         ex:'$forEach[x;y;,;$forEachValue]  →  x then y' },
  { name:'foreachindex',          cat:'control',    syntax:'$forEachIndex',                                desc:'0-based iteration index inside a $forEach body',                       ex:'$forEachIndex  →  0, 1, 2...' },
  { name:'foreachnumber',         cat:'control',    syntax:'$forEachNumber',                               desc:'1-based iteration number inside a $forEach body',                      ex:'$forEachNumber  →  1, 2, 3...' },
  { name:'break',                 cat:'control',    syntax:'$break',                                       desc:'Exit the innermost $while or $forEach loop immediately',               ex:'$while[true;$if[$x>10;$break]]' },
  { name:'continue',              cat:'control',    syntax:'$continue',                                    desc:'Skip the rest of the current iteration and move to the next',          ex:'$forEach[1,2,3;,;$if[$forEachValue==2;$continue]...]' },

  // ── Strings — text split ──────────────────────────────────────────────────
  { name:'textsplit',             cat:'strings',    syntax:'$textSplit[text;separator]',                   desc:'Split text and store result for indexed access via $getTextSplitIndex', ex:'$textSplit[a,b,c;,]$getTextSplitIndex[2]  →  b' },
  { name:'gettextsplitindex',     cat:'strings',    syntax:'$getTextSplitIndex[index]',                    desc:'Get the 1-based element from the last $textSplit result',               ex:'$textSplit[x;y;z; ]$getTextSplitIndex[1]  →  x' },

  // ── HTTP ──────────────────────────────────────────────────────────────────
  { name:'httpget',               cat:'http',       syntax:'$httpGet[url;headers?]',                       desc:'Send an HTTP GET request and return the response body',                ex:'$httpGet[https://api.example.com/data]' },
  { name:'httppost',              cat:'http',       syntax:'$httpPost[url;body;headers?]',                 desc:'Send an HTTP POST request with a body, return response',               ex:'$httpPost[https://api.example.com;{"key":"val"}]' },
  { name:'httpput',               cat:'http',       syntax:'$httpPut[url;body;headers?]',                  desc:'Send an HTTP PUT request with a body, return response',                ex:'$httpPut[https://api.example.com/1;{"x":"2"}]' },
  { name:'httpdelete',            cat:'http',       syntax:'$httpDelete[url;headers?]',                    desc:'Send an HTTP DELETE request and return the response body',             ex:'$httpDelete[https://api.example.com/item/1]' },

  // ── Webhooks ──────────────────────────────────────────────────────────────
  { name:'createwebhook',         cat:'webhooks',   syntax:'$createWebhook[channelID;name;avatarURL?]',    desc:'Create a webhook in a channel. Returns JSON with id and token',        ex:'$createWebhook[$channelID;My Bot]' },
  { name:'deletewebhook',         cat:'webhooks',   syntax:'$deleteWebhook[webhookID;token]',              desc:'Delete a webhook by ID and token',                                     ex:'$deleteWebhook[123456;abc_token]' },
  { name:'webhooksend',           cat:'webhooks',   syntax:'$webhookSend[id;token;content;username?;avatarURL?]', desc:'Send a message via webhook with optional custom name/avatar',   ex:'$webhookSend[id;token;Hello from webhook!]' },

  // ── Threads ───────────────────────────────────────────────────────────────
  { name:'createthread',          cat:'threads',    syntax:'$createThread[name;messageID?;channelID?;autoArchiveMinutes?]', desc:'Create a thread (from a message or standalone). Returns thread ID', ex:'$createThread[Help Thread;;$channelID]' },
  { name:'archivethread',         cat:'threads',    syntax:'$archiveThread[threadID]',                     desc:'Archive a thread channel by ID',                                       ex:'$archiveThread[123456789]' },
  { name:'lockthread',            cat:'threads',    syntax:'$lockThread[threadID]',                        desc:'Lock a thread so only moderators can post in it',                      ex:'$lockThread[123456789]' },

  // ── Permissions ───────────────────────────────────────────────────────────
  { name:'hasperms',              cat:'permissions',syntax:'$hasPerms[userID;perm1;perm2;...]',             desc:'Returns "true" if the user has ALL listed Discord permissions',        ex:'$hasPerms[$userID;Administrator]  →  true' },
  { name:'bothasperms',           cat:'permissions',syntax:'$botHasPerms[perm1;perm2;...]',                desc:'Returns "true" if the bot has ALL listed permissions in this channel', ex:'$botHasPerms[SendMessages;EmbedLinks]  →  true' },

  // ── Error Handling ────────────────────────────────────────────────────────
  { name:'try',                   cat:'errorhandling', syntax:'$try[code;fallback]',                       desc:'Run code lazily; if it errors, run fallback instead',                  ex:'$try[$httpGet[url];Request failed!]' },
  { name:'throw',                 cat:'errorhandling', syntax:'$throw[message]',                           desc:'Produce an [error: message] and stop execution — useful inside $try',  ex:'$if[$x==bad;$throw[Invalid input]]' },
  { name:'suppresserrors',        cat:'errorhandling', syntax:'$suppressErrors[code]',                     desc:'Run code and silently remove any [error:...] strings from output',     ex:'$suppressErrors[$httpGet[bad-url]]  →  (empty)' },

  // ── Blacklist ─────────────────────────────────────────────────────────────
  { name:'blacklistuser',         cat:'blacklist',  syntax:'$blacklistUser[userID;guildID?]',               desc:'Add a user to the persistent guild blacklist',                         ex:'$blacklistUser[$mentioned[1;true]]' },
  { name:'unblacklistuser',       cat:'blacklist',  syntax:'$unblacklistUser[userID;guildID?]',             desc:'Remove a user from the guild blacklist',                               ex:'$unblacklistUser[$mentioned[1;true]]' },
  { name:'isblacklisted',         cat:'blacklist',  syntax:'$isBlacklisted[userID?;guildID?]',              desc:'Returns "true" if the user is blacklisted, otherwise "false"',         ex:'$onlyIf[$not[$isBlacklisted]]' },

  // ── Moderation (additions) ────────────────────────────────────────────────
  { name:'mute',                  cat:'moderation', syntax:'$mute[userID;durationMs;reason?]',              desc:'Timeout (mute) a member for a duration in milliseconds',               ex:'$mute[$mentioned[1;true];600000;Spamming]' },
  { name:'warn',                  cat:'moderation', syntax:'$warn[userID;reason?;guildID?]',                desc:'Add a persistent warning to a user. Returns new warning count',        ex:'$warn[$mentioned[1;true];Bad language]  →  1' },

  // ── Discord (additions) ───────────────────────────────────────────────────
  { name:'uptime',                cat:'discord',    syntax:'$uptime[format?]',                             desc:'Bot uptime. format: human (default) | seconds | ms',                   ex:'$uptime  →  2d 3h 15m 4s' },

  // ── Components (additions) ────────────────────────────────────────────────
  { name:'linkbutton',            cat:'components', syntax:'$linkButton[label;url;emoji?;disabled?]',       desc:'Add a link button that opens a URL in the browser',                    ex:'$linkButton[Visit site;https://example.com]' },
  { name:'actionrow',             cat:'components', syntax:'$actionRow',                                    desc:'Force-close the current action row and start a new one (max 5 rows)',  ex:'$button[A;a]$actionRow$button[B;b]' },
];

// ─── Category metadata ────────────────────────────────────────────────────────
const CAT_EMOJI = {
  discord:      '🔵',
  message:      '📨',
  moderation:   '🔨',
  roles:        '🎭',
  channels:     '📢',
  variables:    '📦',
  database:     '🗄️',
  control:      '🔀',
  logic:        '🔣',
  math:         '🔢',
  strings:      '🔤',
  embeds:       '🖼️',
  components:   '🧩',
  time:         '🕐',
  cooldown:     '⏳',
  reactions:    '😀',
  emojis:       '✨',
  random:       '🎲',
  http:         '🌐',
  webhooks:     '🪝',
  threads:      '🧵',
  permissions:  '🔐',
  errorhandling:'🛡️',
  blacklist:    '🚫',
  misc:         '⚙️',
};

const CAT_ORDER = [
  'discord','message','moderation','roles','channels',
  'variables','database',
  'control','logic',
  'math','strings','embeds','components',
  'time','cooldown','reactions','emojis','random',
  'http','webhooks','threads','permissions','errorhandling','blacklist',
  'misc',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalise(raw) {
  return raw.trim().replace(/^\$/, '').toLowerCase();
}

function displayName(doc) {
  return doc.syntax.split(/[\[\/\s]/)[0].slice(1);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatFull(doc) {
  return [
    `📖 **$${displayName(doc)}**`,
    '```',
    `Syntax    : ${doc.syntax}`,
    `Category  : ${doc.cat}`,
    '',
    doc.desc,
    '',
    `Example   : ${doc.ex}`,
    '```',
  ].join('\n');
}

function formatCompact(doc) {
  return `\`${doc.syntax.padEnd(42)}\` ${doc.desc}`;
}

function formatCategoryList() {
  const lines = ['📚 **CenzoJS Functions** — use `!find $function` or `!find <category>` to search\n'];
  for (const cat of CAT_ORDER) {
    const entries = DOCS.filter(d => d.cat === cat);
    if (!entries.length) continue;
    const names = entries.map(d => `\`$${displayName(d)}\``).join(' ');
    lines.push(`${CAT_EMOJI[cat]} **${cat}** (${entries.length})`);
    lines.push(names);
    lines.push('');
  }
  lines.push(`_${DOCS.length} functions total_`);
  return lines.join('\n');
}

// ─── $find[query?] ────────────────────────────────────────────────────────────

module.exports = async (context, args) => {
  const query = normalise(args[0] || '');

  // ── No query: full overview ────────────────────────────────────────────────
  if (!query) return formatCategoryList();

  // ── Category filter ────────────────────────────────────────────────────────
  if (CAT_ORDER.includes(query)) {
    const entries = DOCS.filter(d => d.cat === query);
    const header  = `${CAT_EMOJI[query]} **${query}** — ${entries.length} functions\n`;
    return header + entries.map(formatCompact).join('\n');
  }

  // ── Exact name match → full detail ────────────────────────────────────────
  const exact = DOCS.find(d => d.name === query);
  if (exact) return formatFull(exact);

  // ── Partial / keyword search ───────────────────────────────────────────────
  const matches = DOCS.filter(d =>
    d.name.includes(query) ||
    displayName(d).toLowerCase().includes(query) ||
    d.syntax.toLowerCase().includes(query) ||
    d.desc.toLowerCase().includes(query) ||
    d.ex.toLowerCase().includes(query)
  );

  if (!matches.length) {
    return [
      `❌ **No functions found for \`$${normalise(args[0] || '')}\`**`,
      '',
      'Try a category name: `discord` `math` `strings` `embeds` `moderation` `cooldown` `reactions` `emojis` `random`',
      'Or browse everything: `!find`',
    ].join('\n');
  }

  if (matches.length === 1) return formatFull(matches[0]);

  const header = `🔍 **${matches.length} results for \`$${query}\`:**\n`;
  const body   = matches.map(formatCompact).join('\n');
  return header + body;
};
