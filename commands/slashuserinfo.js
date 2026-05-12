/**
 * Example slash command with options: /userinfo [user]
 *
 * The `user` option is a Discord user picker in the slash UI.
 * When used as a prefix command (!userinfo), $arg[1] is used instead.
 */
module.exports = {
  name:        'slashuserinfo',
  description: 'Shows information about a user',
  slash:       true,
  ephemeral:   false,

  options: [
    {
      name:        'user',
      description: 'The user to look up (defaults to you)',
      type:        'user',
      required:    false,
    },
  ],

  // $option[user;user] returns the selected user's ID in slash context
  // Falls back to the command author if nothing selected
  code: `
$setVar[uid;$option[user;user]]
$if[$getVar[uid]==;$setVar[uid;$userID]]
**User Info** for <@$getVar[uid]>
> **Username:** $username[$getVar[uid]]
> **ID:** $getVar[uid]
> **Created:** $userCreatedAt[$getVar[uid]]
> **Bot:** $isBot[$getVar[uid]]
  `.trim(),
};
