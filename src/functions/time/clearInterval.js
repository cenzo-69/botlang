'use strict';

const { argError } = require('../../core/fnError');
// $clearInterval[name]  — clears a named interval created by $setInterval
module.exports = async (context, args) => {
  const name = String(args[0] !== undefined ? args[0] : '').trim();
  if (!name) return argError(context, 'name', 'string', name);
  const setIntervalMod = require('./setInterval');
  const store = setIntervalMod._store;
  if (!store || !store.has(name)) return 'false';
  clearInterval(store.get(name));
  store.delete(name);
  return 'true';
};
