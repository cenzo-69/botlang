'use strict';
// $clearTimeout[name]  — clears a named timeout created by $setTimeout
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return '[error: $clearTimeout — timeout name is required]';
  // Access the shared store from setTimeout module
  const setTimeoutMod = require('./setTimeout');
  const store = setTimeoutMod._store;
  if (!store || !store.has(name)) return 'false';
  clearTimeout(store.get(name));
  store.delete(name);
  return 'true';
};
