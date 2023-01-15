import { AttachmentBuilder, SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notes')
        .setDescription('The main Notes command.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new note.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to add the note to.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('note')
                        .setDescription('The note to add.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a note.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to remove the note from.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option
                        .setName('index')
                        .setDescription('The note index to remove.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Get a user\'s notes.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to get the notes for.')
                        .setRequired(true)
                )     
        ),

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('Base command executed!')
    },
};
