const { ButtonInteraction } = require('discord.js');

module.exports = {
  name: 'delete_ticket',
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(client, config, interaction) {
    try {
      // تأكيد الحذف برد
      await interaction.reply({ content: '**سيتم حذف التذكرة خلال 5 ثوانٍ**', ephemeral: true });

      // حذف قناة التذكرة بعد فترة قصيرة (اختياري)
      setTimeout(() => interaction.channel.delete(), 5000); // تأخير 5 ثوانٍ قبل الحذف
    } catch (error) {
      await interaction.editReply({ content: 'حدث خطأ أثناء حذف التذكرة!', ephemeral: true });
    }
  },
};
