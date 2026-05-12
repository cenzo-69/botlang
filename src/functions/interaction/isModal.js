'use strict';
// $isModal  — returns "true" if the current interaction is a modal submit
module.exports = async (context) => {
  const i = context.interaction;
  return String(!!(i && i.isModalSubmit?.()));
};
