module.exports = {
  name:        'userinfo',
  description: 'Display info about yourself or a mentioned user',
  code: `
👤 **User Info**
Name:    $username
ID:      $userID
Avatar:  $avatar[$mentioned[1;true]]
Server:  $guildName
Members: $memberCount
  `.trim(),
};
