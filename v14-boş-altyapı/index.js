import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.prefixCommands = new Collection();
client.slashCommands = new Collection();

const slashCommandsArray = [];

const prefixFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith('.js'));
for (const file of prefixFiles) {
    const command = await import(`./commands/prefix/${file}`);
    client.prefixCommands.set(command.default.name, command.default);
}

const slashFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
for (const file of slashFiles) {
    const command = await import(`./commands/slash/${file}`);
    client.slashCommands.set(command.default.data.name, command.default);
    slashCommandsArray.push(command.default.data.toJSON());
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
}

client.once('ready', async () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log('Slash komutları yenileniyor...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommandsArray },
        );
        console.log('Slash komutları başarıyla yüklendi!');
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.TOKEN);