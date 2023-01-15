import { AttachmentBuilder, SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js';
import * as fs from 'fs';
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
        await interaction.deferReply();
        const notes = JSON.parse(fs.readFileSync('./notes.json').toString());
        const userid = interaction.options.getUser('user').id;
        switch (interaction.options.getSubcommand()) {
            case 'add':
                const note = interaction.options.getString('note');
                if (!notes[userid]) notes[userid] = { notes: [] };
                notes[userid].notes.push(note);
                fs.writeFileSync('./notes.json', JSON.stringify(notes));
                interaction.editReply('Added note.');
                break;
            case 'remove':
                const index = interaction.options.getNumber('index');
                if (!notes[userid]) return await interaction.editReply("That user doesn't have any notes.");
                if (!notes[userid].notes[index - 1]) return await interaction.editReply("That note doesn't exist.");
                notes[userid].notes = notes[userid].notes.filter(function(item) {
                    return notes[userid].notes.indexOf(item) !== index - 1;
                })
                fs.writeFileSync('./notes.json', JSON.stringify(notes));
                await interaction.editReply('Removed note.');
                break;
            case 'get':
                if (!notes[userid]) return await interaction.editReply("That user doesn't have any notes.");
                if (!notes[userid].notes.length) return await interaction.editReply("That user doesn't have any notes.");
                let notesString = '';
                notes[userid].notes.forEach((note, index) => {
                    notesString += `${index + 1}. ${note}\n`;
                });
                await interaction.editReply(`\`\`\`${notesString}\`\`\``);
                break;
        }

            
    },
};
