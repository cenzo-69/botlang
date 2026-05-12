'use strict';
const os = require('os');
// $ramTotal  — returns total system RAM in GB
module.exports = async () => String(parseFloat((os.totalmem() / 1024 / 1024 / 1024).toFixed(2)));
