const {
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  ButtonStyle,
  ChannelType,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "create_ticket",
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    const { guild, user } = interaction;
    const [, , id] = interaction.customId.split("_");
    await interaction.deferReply({ ephemeral: true });

    try {
      const ticketCategory = interaction.guild.channels.cache.get(config.ticketCategoryID);

      if (!ticketCategory) {
        return;
      }

      const hasTicket = await ticketCategory.children.cache.find(ch => ch.topic === interaction.user.id);
      if (hasTicket) {
        interaction.editReply({
          content: "لديك بالفعل تذكرة.",
          ephemeral: true,
        });
        return;
      }

      const { roleID, image } = config.SECTIONS[Number(id)];
      config.ticketNumber++;
      fs.writeFileSync("config.json", JSON.stringify(config, null, 2));

      // إنشاء قناة جديدة للتذكرة
      const ticketChannel = await guild.channels.create({
        name: `ticket-${config.ticketNumber}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryID,
        topic: interaction.user.id,
        permissionOverwrites: [
          {
            id: roleID,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      const attachment = new AttachmentBuilder(image, { name: "ticket.png" });

      // إرسال تنبيه فوق الرسالة المدمجة
      await ticketChannel.send({
        content: `**<@${user.id}> , <@&${roleID}>**`,
      });

      // إنشاء الرسالة المدمجة
      const embed = new EmbedBuilder()
        .setTitle("مرحبا بك في تذكرتك للدعم")
        .setDescription(`**<@${user.id}> افتتح تذكرة دعم. سيساعدك عضو من <@&${roleID}> قريبًا.**`)
        .setColor(0x00AE86) // لون الرسالة المدمجة
        .setImage('attachment://ticket.png'); // استخدام الصورة المرفقة كخلفية

      // أزرار لإجراءات التذكرة
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`close_ticket*_${roleID}`)
          .setLabel("إغلاق التذكرة")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`claim_ticket`)
          .setLabel("تحمل التذكرة")
          .setStyle(ButtonStyle.Secondary)
      );

      // إرسال الرسالة المدمجة في قناة التذكرة
      await ticketChannel.send({
        embeds: [embed],
        files: [attachment],
        components: [row],
      });

      await interaction.editReply({
        content: `تم إنشاء التذكرة! يرجى التحقق من ${ticketChannel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("خطأ أثناء إنشاء قناة التذكرة:", error);
      await interaction.editReply({
        content: "حدث خطأ أثناء إنشاء التذكرة!",
        ephemeral: true,
      });
    }
  },
};
