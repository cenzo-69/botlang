'use strict';
// $isButton  — returns "true" if the current interaction is a button click
module.exports = async (context) => {
  const i = context.interaction;
  return String(!!(i && i.isButton?.()));
};
