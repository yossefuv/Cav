const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
	const s = '[**»**](https://google.com/)';
	const { usedWords, count } = client.db.get(message.guild.id).messages;
	const usedWordsSort = [];
	Object.entries(usedWords).map(([key, value]) => usedWordsSort.push([key, value]));
	usedWordsSort.sort(function (a, b) {
		return b[1] - a[1];
	});

	message.channel.send(
		new MessageEmbed()
			.setAuthor(`Showing the top 20 words used in ${message.guild.name}`, message.guild.iconURL())
			.setDescription(usedWordsSort.slice(0, 20).map(w => `${s} **${w[0]}**: \`${w[1]} times\``))
	);
};

exports.help = {
	name: 'topwords',
	aliases: [],
	description: 'Shows top 20 words used in this server',
	usage: 'topwords',
};
