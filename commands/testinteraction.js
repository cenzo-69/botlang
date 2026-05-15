/**
 * testinteraction — Sends a panel with a button, a modal trigger, and a select menu.
 * Run with: /testinteraction  or  !testinteraction
 */
module.exports = {
  name:        'testinteraction',
  description: 'Tests all interaction types: buttons, modals, and select menus',
  slash:       true,

  code: [
    '$title[🧪 Interaction Test Panel]',
    '$color[FEE75C]',
    '$description[Use the components below to test all interaction types.]',
    '$field[✅ Button;Click **Test Button** — bot replies with a confirmation message.;false]',
    '$field[📝 Modal;Click **Open Modal** — a form pops up to fill in.;false]',
    '$field[📋 Select Menu;Choose an option from the dropdown below.;false]',
    // Row 1: buttons
    '$button[✅ Test Button;testbtn;success]',
    '$button[📝 Open Modal;testmodalopen;primary]',
    // Row 2: select menu
    '$actionRow',
    '$addStringSelect[testselect;📋 Choose an option...;1;1]',
    '$addStringSelectOption[testselect;ping;🏓 Ping;Test a ping option]',
    '$addStringSelectOption[testselect;info;ℹ️ Info;Test an info option]',
    '$addStringSelectOption[testselect;stats;📊 Stats;Test a stats option]',
  ].join('\n'),
};
