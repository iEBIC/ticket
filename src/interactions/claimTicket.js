const { ButtonInteraction, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'claim_ticket',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    try {
      await interaction.deferReply({});
      if (interaction.user.id == interaction.channel.topic) {
        await interaction.editReply({ content: 'لا يمكن استخدام هذا الزر إلا من قبل موظفي التذاكر.', ephemeral: true });
        return;
      }
      // تحديث أذونات القناة
      await interaction.channel.permissionOverwrites.set([
        {
          id: interaction.guildId,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: interaction.channel.topic,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ]);
      interaction.message.components[0].components[1].data.disabled = true;
      interaction.message.edit({ components: interaction.message.components });
      // الرد على تفاعل التذكرة
      await interaction.editReply({
        content: `**تم التعامل مع التذكرة**\nتم التعامل مع هذه التذكرة بواسطة <@${interaction.user.id}>.`,
      });
    } catch (error) {
      await interaction.editReply({ content: 'حدث خطأ أثناء التعامل مع هذه التذكرة.', ephemeral: true });
    }
  },
};
