export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Komut çalıştırılırken hata oluştu!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Komut çalıştırılırken hata oluştu!', ephemeral: true });
            }
        }
    },
};