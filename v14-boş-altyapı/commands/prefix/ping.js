export default {
    name: 'ping',
    description: 'Botun gecikme süresini gösterir.',
    execute(message, args, client) {
        message.reply(`Pong! Gecikme: ${client.ws.ping}ms`);
    },
};