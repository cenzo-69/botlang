'use strict';
// $isAutocomplete  — returns "true" if the current interaction is an autocomplete
module.exports = async (context) => {
  const i = context.interaction;
  return String(!!(i && i.isAutocomplete?.()));
};
