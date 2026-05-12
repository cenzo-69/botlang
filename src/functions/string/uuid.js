'use strict';

const { randomUUID } = require('crypto');

// $uuid[]  — generate a random UUID v4
module.exports = async (context, args) => {
  return randomUUID();
};
