'use strict';

/**
 * /testinteraction — Full interaction type showcase panel.
 * Tests buttons (success + primary), a modal, and a select menu all at once.
 *
 * Handlers: testbtn.js, testmodalopen.js, testmodalsubmit.js, testselect.js
 * Run with: /testinteraction  or  !testinteraction
 */
module.exports = {
  name:        'testinteraction',
  description: 'Test all interaction types: buttons, modal, and select menu',
  slash:       true,
  ephemeral:   false,

  code: [
    '$title[🧪 Interaction Test Panel]',
    '$color[FEE75C]',
    '$thumbnail[$botAvatar]',
    '$description[Use the components below to confirm that every interaction type is working.$newlineAll responses are **ephemeral** — only you will see them.]',

    '$addField[✅ Button — Success;Click **Test Button**.$newlineBot will reply with a confirmation embed showing who clicked and when.;false]',
    '$addField[📝 Button — Modal;Click **Open Modal**.$newlineA pop-up form appears. Type anything and submit — bot echoes your input.;false]',
    '$addField[📋 Select Menu;Pick an option from the dropdown below.$newlineBot replies with the selected value and your user info.;false]',
    '$addField[🗄️ Database Round-trip;Click **DB Test** to write your user ID to PostgreSQL and read it back instantly.;false]',

    // Row 1 — buttons
    '$button[✅ Test Button;testbtn;success]',
    '$button[📝 Open Modal;testmodalopen;primary]',
    '$button[🗄️ DB Test;testdbbtn;secondary]',

    // Row 2 — select menu (must be in its own action row)
    '$actionRow',
    '$addStringSelect[testselect;📋 Pick an option to test...;1;1]',
    '$addStringSelectOption[testselect;ping;🏓 Ping;Replies with your latency]',
    '$addStringSelectOption[testselect;info;ℹ️ Info;Shows your user info]',
    '$addStringSelectOption[testselect;stats;📊 Stats;Shows server stats]',
    '$addStringSelectOption[testselect;random;🎲 Random;Shows a random number]',
    '$addStringSelectOption[testselect;time;🕐 Time;Shows current date and time]',

    '$footer[CenzoJS v2.0 — Interaction system ✓]',
    '$timestamp',
  ].join('\n'),
};
