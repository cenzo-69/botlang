'use strict';

// $sort[a;b;c;...;asc|desc?]
// Sort a list of numbers. Last arg can be "asc" or "desc" (default: asc).
// Example: $sort[5;2;8;1]       → 1,2,5,8
//          $sort[5;2;8;1;desc]  → 8,5,2,1
module.exports = async (context, args) => {
  if (!args.length) return '';
  let items = [...args];
  let order = 'asc';

  const last = (items[items.length - 1] || '').toLowerCase();
  if (last === 'asc' || last === 'desc') {
    order = last;
    items = items.slice(0, -1);
  }

  const nums = items.map(a => parseFloat(a));
  if (nums.some(isNaN)) {
    // Sort as strings if not all numeric
    const sorted = items.slice().sort((a, b) => a.localeCompare(b));
    return order === 'desc' ? sorted.reverse().join(',') : sorted.join(',');
  }

  nums.sort((a, b) => a - b);
  if (order === 'desc') nums.reverse();
  return nums.join(',');
};
