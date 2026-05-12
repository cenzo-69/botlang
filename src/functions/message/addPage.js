'use strict';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// $addPage[content]
// Add a page to the paginated output. Call multiple times to build pages.
// When the command finishes, CenzoJS sends the first page with Prev/Next buttons.
// Each page is a plain text string (can contain embed-formatted content).
//
// Example:
//   $addPage[Page one content]
//   $addPage[Page two content]
//   $addPage[Page three content]

module.exports = async (context, args) => {
  const content = String(args[0] ?? '');

  if (!context._out._pages) context._out._pages = [];
  context._out._pages.push(content);

  // Mark that pagination is active — Runtime will handle sending
  context._out._paginated = true;
  return '';
};

// Helper used by Runtime to send paginated output
module.exports.sendPaginated = async (message, pages) => {
  if (!pages || pages.length === 0) return;

  let current = 0;

  const buildRow = (index) => new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('page_prev')
      .setLabel('◀ Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(index === 0),
    new ButtonBuilder()
      .setCustomId('page_next')
      .setLabel('Next ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(index === pages.length - 1),
    new ButtonBuilder()
      .setCustomId('page_stop')
      .setLabel('✕')
      .setStyle(ButtonStyle.Danger),
  );

  const sent = await message.channel.send({
    content: `**Page ${current + 1}/${pages.length}**\n${pages[current]}`,
    components: pages.length > 1 ? [buildRow(current)] : [],
  });

  if (pages.length <= 1) return;

  const collector = sent.createMessageComponentCollector({
    filter: i => i.user.id === message.author.id,
    time: 120_000,
  });

  collector.on('collect', async interaction => {
    if (interaction.customId === 'page_stop') {
      collector.stop();
      await interaction.update({ components: [] });
      return;
    }
    if (interaction.customId === 'page_prev') current = Math.max(0, current - 1);
    if (interaction.customId === 'page_next') current = Math.min(pages.length - 1, current + 1);
    await interaction.update({
      content: `**Page ${current + 1}/${pages.length}**\n${pages[current]}`,
      components: [buildRow(current)],
    });
  });

  collector.on('end', async () => {
    await sent.edit({ components: [] }).catch(() => {});
  });
};
