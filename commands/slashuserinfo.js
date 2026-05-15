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

  code: `
$setVar[uid; $option[user;user]]
$if[$getVar[uid]==; $setVar[uid; $userID]]
**User Info** for <@$getVar[uid]>
> **Username:** $username[$getVar[uid]]
> **ID:** $getVar[uid]
> **Created:** $userCreatedAt[$getVar[uid]]
> **Bot:** $isBot[$getVar[uid]]
  `.trim(),
};
