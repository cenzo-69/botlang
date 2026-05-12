'use strict';
// $getCooldownTime  — returns the remaining cooldown time in milliseconds (from last cooldown check)
module.exports = async (context) => String(context.variables.get('__cd_remaining__') ?? '0');
