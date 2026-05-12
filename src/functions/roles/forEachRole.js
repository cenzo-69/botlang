'use strict';

// $forEachRole[code;separator?]
// Iterates over every role in the guild.
// Inside code use $roleID, $roleName, $loopIndex.
// Returns all iterations joined by separator (default newline).
module.exports = async (context, args) => {
  const code = String(args[0] ?? '');
  const sep  = args[1] !== undefined ? String(args[1]) : '\n';

  const guild = context.message?.guild;
  if (!guild) return '[forEachRole error: no guild]';

  const roles = [...guild.roles.cache.values()];
  const results = [];

  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    const vars = new Map(context.variables);
    vars.set('$roleID',    role.id);
    vars.set('$roleName',  role.name);
    vars.set('$loopIndex', String(i + 1));

    const subCtx = Object.assign(Object.create(Object.getPrototypeOf(context)), context, { variables: vars });
    try {
      const result = await context.runtime.execute(code, subCtx);
      results.push(result);
    } catch (e) {
      results.push(`[error: ${e.message}]`);
    }
  }

  return results.join(sep);
};
