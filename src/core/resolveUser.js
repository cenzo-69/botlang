'use strict';

/**
 * Shared helpers for resolving a Discord member or user by ID.
 * All user-info functions ($displayName, $userJoined, etc.) use these.
 *
 * If userID is omitted / empty, falls back to the message author.
 */

async function resolveMember(context, userID) {
  if (!context.message?.guild) return null;
  const id = (userID && String(userID).trim()) ? String(userID).trim() : context.message.author?.id;
  if (!id) return null;
  try {
    return await context.message.guild.members.fetch(id);
  } catch {
    return null;
  }
}

async function resolveUser(context, userID) {
  if (!context.client) return null;
  const id = (userID && String(userID).trim()) ? String(userID).trim() : context.message?.author?.id;
  if (!id) return null;
  try {
    return await context.client.users.fetch(id, { force: true });
  } catch {
    return null;
  }
}

module.exports = { resolveMember, resolveUser };
