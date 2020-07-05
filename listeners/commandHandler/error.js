const { Listener } = require('discord-akairo');

module.exports = class ErrorListener extends Listener {
	constructor() {
		super('error', {
			event: 'error',
			emitter: 'commandHandler',
			category: 'commandHandler',
		});
	}

	exec(err, message) {
	  message.channel.send('An error has occurred... contact the bot admin to get this fixed');
      var botDev = this.client.users.cache.get("191615236363649025");
      if (!botDev) return;
      botDev.send(`Bot Error in ${message.guild.name} » ${err.name}: \n ${err.stack}`)

	}
};
