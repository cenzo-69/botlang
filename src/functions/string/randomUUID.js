'use strict';
const { randomUUID } = require('crypto');
// $randomUUID  — returns a random RFC 4122 UUID v4
module.exports = async () => randomUUID();
