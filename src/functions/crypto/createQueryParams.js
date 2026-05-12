'use strict';
// $createQueryParams[name1;value1;name2;value2;...]  — builds a URL query string
module.exports = async (context, args) => {
  if (args.length < 2) return '[error: $createQueryParams — requires at least one name;value pair]';
  const params = new URLSearchParams();
  for (let i = 0; i < args.length - 1; i += 2) {
    params.append(String(args[i]), String(args[i + 1] !== undefined ? args[i + 1] : ''));
  }
  return params.toString();
};
