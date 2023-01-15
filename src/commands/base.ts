import { AttachmentBuilder, SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('base')
        .setDescription('Base command'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('Base command executed!')
    },
};
