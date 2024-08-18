const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'close_ticket',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    try {
      const [, , roleID] = interaction.customId.split('_');
      await interaction.deferReply({});
      await interaction.channel.permissionOverwrites.set([
        {
          id: interaction.guildId,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.channel.topic,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: roleID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ]);
      // رسالة تأكيد بإغلاق التذكرة
      const embed = new EmbedBuilder()
        .setColor('#ff5555')
        .setTitle('التذكرة مغلقة')
        .setDescription('تم إغلاق هذه التذكرة. اضغط على الزر أدناه إذا كنت ترغب في حذف هذه التذكرة.');

      // زر لتأكيد حذف التذكرة
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('delete_ticket').setLabel('حذف التذكرة').setStyle(ButtonStyle.Secondary),
      );
      interaction.message.components[0].components[0].data.disabled = true;
      interaction.message.components[0].components[1].data.disabled = true;
      interaction.message.edit({ components: interaction.message.components });
      // إرسال الرسالة المدمجة والزر
      await interaction.editReply({ embeds: [embed], components: [row] });
      const user = await interaction.guild.members.fetch(interaction.channel.topic).catch(() => {});
      // إنشاء رسالة مدمجة بمعلومات حول التذكرة المغلقة
      const userEmbed = new EmbedBuilder()
        .setTitle('تم إغلاق تذكرتك')
        .setColor('#05131f')
        .addFields(
          { name: 'التذكرة افتتحها', value: `<@${interaction.channel.topic}>`, inline: true },
          { name: 'التذكرة أُغلقت بواسطة', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'وقت الفتح', value: new Date(interaction.channel.createdTimestamp).toLocaleString(), inline: true },
          { name: 'وقت الإغلاق', value: new Date().toLocaleString(), inline: true }
        );

      if (user) user.send({ embeds: [userEmbed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply({ content: 'حدث خطأ أثناء إغلاق التذكرة.', ephemeral: true });
    }
  },
};
