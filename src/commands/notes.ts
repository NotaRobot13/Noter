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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addrole')
                .setDescription('Add a role to the list of roles that can use this command.')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to add.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('removerole')
                .setDescription('Remove a role from the list of roles that can use this command.')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to remove.')
                        .setRequired(true)
                )
        ),

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        await interaction.deferReply();
        const notes = JSON.parse(fs.readFileSync('./info.json').toString());
        const userid = interaction.options.getUser('user')?.id;
        const roles = JSON.parse(fs.readFileSync('./roles.json').toString());
        // loop over the stored roles and check if the user has any of them
        let hasRole = false;
        for (const role of interaction.guild.roles.cache.map(role => role)) {
            if (roles.includes(role.id)) hasRole = true;
        }
        if (interaction.guild.ownerId == interaction.user.id) hasRole = true;
        if (!hasRole) return await interaction.editReply('You don\'t have permission to use this command.');
        const role = interaction.options.getRole('role')?.id;
        switch (interaction.options.getSubcommand()) {
            case 'add':
                const note = interaction.options.getString('note');
                if (!notes[userid]) notes[userid] = { notes: [] };
                notes[userid].notes.push(note);
                fs.writeFileSync('./info.json', JSON.stringify(notes));
                interaction.editReply('Added note.');
                break;
            case 'remove':
                const index = interaction.options.getNumber('index');
                if (!notes[userid]) return await interaction.editReply("That user doesn't have any notes.");
                if (!notes[userid].notes[index - 1]) return await interaction.editReply("That note doesn't exist.");
                notes[userid].notes = notes[userid].notes.filter(function (item) {
                    return notes[userid].notes.indexOf(item) !== index - 1;
                })
                fs.writeFileSync('./info.json', JSON.stringify(notes));
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
            case 'addrole':
                if (!role) return await interaction.editReply('That role doesn\'t exist.');
                if (roles.includes(role)) return await interaction.editReply('That role is already in the list.');
                roles.push(role);
                fs.writeFileSync('./roles.json', JSON.stringify(roles));
                await interaction.editReply('Added role.');
                break;
            case 'removerole':
                if (!role) return await interaction.editReply('That role doesn\'t exist.');
                if (!roles.includes(role)) return await interaction.editReply('That role isn\'t in the list.');
                roles.splice(roles.indexOf(role), 1);
                fs.writeFileSync('./roles.json', JSON.stringify(roles));
                await interaction.editReply('Removed role.');
                break;
        }


    },
};
