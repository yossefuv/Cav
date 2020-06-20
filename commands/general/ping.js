const {
    Command
} = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            category: 'general',
			description: { content: 'ping anyone?' },
        });
    }

    async exec(message) {
        const msg = await message.channel.send('Ping?');
        msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(this.client.ws.ping)}ms\`.`);
    }
}

module.exports = PingCommand;