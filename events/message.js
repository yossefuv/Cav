const { prefix } = require('../config');

let settings;
module.exports = async (client, message) => {
	if (!message.guild || message.author.bot) return;
	settings = client.db.get(message.guild.id);

	const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
	const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

	await LogMsg(client, message);

	const getPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`);
	if (message.content.match(getPrefix)) return message.channel.send(`My prefix in this guild is \`${prefix}\``);

	if (message.content.indexOf(newPrefix) !== 0) return;

	const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) return;

	cmd.run(client, message, args);
};

async function LogMsg(client, message) {
	// eslint-disable-next-line prefer-const
	if (settings.enabled) {
		if (!settings.messages) settings.messages = { usedWords: {}, count: 0 };

		let { usedWords, count } = settings.messages;

		if (!usedWords) usedWords = {};
		if (!count) count = 0;
		if (!message.content.startsWith(prefix)) {
			const msgArr = message.content.split(' ');

			await msgArr.map(w => {
				usedWords[w] ? (usedWords[w] += 1) : (usedWords[w] = 1);
			});
			client.db.set(message.guild.id, usedWords, 'messages.usedWords');
			client.db.set(message.guild.id, (count += 1), 'messages.count');
		}

		if (settings.loggedChannels.includes(message.channel.id)) {
			const Cmd = message.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();
			const vaildCmd = client.commands.get(Cmd) || client.commands.get(client.aliases.get(Cmd));
			if (vaildCmd && message.member.permissions.has('ADMINISTRATOR')) return;
			if (!settings.channelToLog) return;
			const channel = message.guild.channels.cache.get(settings.channelToLog);
			channel.send(`${message.channel} ${message.author} ${message.content}`);
		}
	}
}

// [Link](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})
