'use strict';

// $listVar[sep?]  — returns all current session variable names joined by sep (default: ,)
module.exports = async (context, args) => {
  const sep = args[0] !== undefined ? args[0] : ',';
  return [...context.variables.keys()].join(sep);
};
