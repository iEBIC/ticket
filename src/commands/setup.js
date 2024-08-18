const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  AttachmentBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js');

module.exports = {
  name: 'setup',
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configurer le message de création de tickets')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Création de l'attachement (image de fond)
    const pièceJointe = new AttachmentBuilder(config.BACKGROUND, { name: 'background.png' });

    // Création des boutons
    const ligne = new ActionRowBuilder().addComponents(
      ...config.SECTIONS.map((section) =>
        new ButtonBuilder()
          .setCustomId(`create_ticket*_${config.SECTIONS.indexOf(section)}`)
          .setLabel(section.name)
          .setStyle(ButtonStyle.Primary),
      ),
    );

    // Création de l'embed
    const embed = new EmbedBuilder()
      .setTitle('.  ﹒ ☻ ┊🐚 𝙏𝙞𝙘𝙠𝙚𝙩𝙨 ﹒ .')
      .setDescription('𝙈𝙚𝙧𝙘𝙞𝙞 𝙙𝙚 𝙣𝙚 𝙥𝙖𝙨 𝙘𝙧𝙚𝙚 𝙪𝙣 𝙩𝙞𝙘𝙠𝙚𝙩𝙨 𝙥𝙤𝙪𝙧 𝙧𝙞𝙚𝙣 ⛱️.')
      .setImage('attachment://background.png') // Utilisation de l'image attachée comme fond
      .setColor(0x00AE86); // Couleur de l'embed

    // Envoi du message avec l'embed et les boutons
    await interaction.channel.send({
      embeds: [embed],
      components: [ligne],
      files: [pièceJointe],
    });

    await interaction.editReply({
      content: 'Le message de configuration des tickets a été envoyé.',
      ephemeral: true,
    });
  },
};
