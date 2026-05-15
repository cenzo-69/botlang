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
    '$title[🧪 Full Interaction Test Panel]',
    '$color[FEE75C]',
    '$thumbnail[$botAvatar]',
    '$description[Every Discord interaction type in one panel. All responses are **ephemeral** (only you see them).$newlineThis message uses all **5 action rows** — the Discord maximum.]',

    '$addField[Row 1 — Buttons (4);✅ Test Button → simple embed reply$newline📝 Simple Modal → single text input$newline📋 Multi Modal → 3 inputs (name · subject · details)$newline🗄️ DB Test → PostgreSQL round-trip;false]',
    '$addField[Row 2 — String Select;Choose from 5 preset options: ping / info / stats / random / time;true]',
    '$addField[Row 3 — User Select;Pick any server member by name;true]',
    '$addField[Row 4 — Role Select;Pick any server role;true]',
    '$addField[Row 5 — Channel Select;Pick any text channel;true]',

    // ── Row 1: four buttons ───────────────────────────────────────────────────
    '$button[✅ Test Button;testbtn;success]',
    '$button[📝 Simple Modal;testmodalopen;primary]',
    '$button[📋 Multi Modal;testmultimodalopen;primary]',
    '$button[🗄️ DB Test;testdbbtn;secondary]',

    // ── Row 2: string select (rowID 0 in __components__) ─────────────────────
    '$addStringSelect[testselect;📋 Pick a preset option...;1;1]',
    '$addStringSelectOption[testselect;ping;🏓 Ping;Check your bot latency]',
    '$addStringSelectOption[testselect;info;ℹ️ Info;See your user info]',
    '$addStringSelectOption[testselect;stats;📊 Stats;Server statistics]',
    '$addStringSelectOption[testselect;random;🎲 Random;Get a random number]',
    '$addStringSelectOption[testselect;time;🕐 Time;Current date and time]',

    // ── Row 3: user select (rowID 1) ──────────────────────────────────────────
    '$addUserSelect[testuserselect;👤 Pick a server member...;1;1;false;1]',

    // ── Row 4: role select (rowID 2) ──────────────────────────────────────────
    '$addRoleSelect[testroleselect;🎭 Pick a role...;1;1;false;2]',

    // ── Row 5: channel select — text channels only (rowID 3) ──────────────────
    '$addChannelSelect[testchannelselect;📢 Pick a text channel...;1;1;false;3;text]',

    '$footer[CenzoJS v2.0 — All 5 action rows ✓  |  Run /eventtest to test events]',
    '$timestamp',
  ].join('\n'),
};
