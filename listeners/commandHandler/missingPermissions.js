const { Listener } = require('discord-akairo');

module.exports = class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			event: 'missingPermissions',
			emitter: 'commandHandler',
			category: 'commandHandler',
		});
	}

	async exec(message, command, type, missing) {
		const text = {
			client: () => {
				const str = this.missingPermissions(missing);
				return `I do not have sufficient permissions to run this command! **(\`${str}\`)**`;
			},
			user: () => {
				const str = this.missingPermissions(missing);
				return `You do not have sufficient permissions to use this command! **(\`${str}\`)**`;
			},
		}[type];
        
		if (!text) return;
		if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) {
			await message.channel.send(text());
		}
	}

	missingPermissions(permissions) {
		var x = Array.isArray(permissions) ? permissions : Array(permissions);
		var missingPerms = x.map(str => {
			switch (permissions) {
				case 'Moderator': return `\`Moderator Role\``;
				break;
				default: return `\`${str
					.replace(/_/g, ' ')
					.toLowerCase()
					.replace(/\b(\w)/g, char => char.toUpperCase())}\``;
			}  
			});

		return missingPerms.length > 1 ? `${missingPerms.slice(0, -1).join(', ')} and ${missingPerms.slice(-1)[0]}` : missingPerms[0];
		}
};
