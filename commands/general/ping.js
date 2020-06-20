const {
    Command
} = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping']
        });
    }

    async exec(message) {
        const msg = await message.channel.send('Ping?');
        msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(this.client.ws.ping)}ms\`.`);
    }
}

module.exports = PingCommand;