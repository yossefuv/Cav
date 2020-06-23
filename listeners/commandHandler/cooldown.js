const { Listener } = require('discord-akairo');

module.exports = class CooldownListener extends Listener {
	constructor() {
		super('cooldown', {
			event: 'cooldown',
			emitter: 'commandHandler',
			category: 'commandHandler',
		});
	}

	exec(message, command, remaining) {
		return message.channel.send(`${message.author.username},You have to wait for another **${remaining / 1000}** seconds before using this command again`);
	}
};
