'use strict';
// $findUser[query;returnAuthor?]  — finds a user by username, globalName, or ID
module.exports = async (context, args) => {
  const query = String(args[0] !== undefined ? args[0] : '').trim();
  const ret   = String(args[1] !== undefined ? args[1] : 'id').toLowerCase();
  if (!query) return '[error: $findUser — query is required]';
  if (!context.client) return '[error: $findUser — no client available]';
  const q    = query.toLowerCase();
  const user = context.client.users.cache.find(u =>
    u.id === query ||
    u.username.toLowerCase().includes(q) ||
    u.globalName?.toLowerCase().includes(q)
  );
  if (!user) {
    // try fetching directly
    try {
      const fetched = await context.client.users.fetch(query).catch(() => null);
      if (!fetched) return '';
      return ret === 'username' ? fetched.username : fetched.id;
    } catch { return ''; }
  }
  switch (ret) {
    case 'username': return user.username;
    case 'tag':      return user.tag;
    default:         return user.id;
  }
};
