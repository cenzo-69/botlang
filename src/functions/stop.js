'use strict';

// $stop  — halts further execution in the current script
module.exports = async (context) => {
  context.stop();
  return '';
};
