'use strict';

// $nodeVersion
// Returns the current Node.js version string (e.g. "v20.11.0").
module.exports = async (context, args) => {
  return process.version;
};
