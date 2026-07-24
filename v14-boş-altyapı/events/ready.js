export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot aktif: ${client.user.tag}`);
    },
};