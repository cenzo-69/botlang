module.exports = {
  name: 'avatar',
  description: 'Show avatar of yourself or a mentioned user',
  code: [
    '🖼️ **Avatar — $username**',
    '$avatar[$mentioned[1;true]]',
  ].join('\n'),
};
