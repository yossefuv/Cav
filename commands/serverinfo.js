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
			.setAuthor(`Showing ${message.guild.name}'s information`, message.guild.iconURL())
			.setDescription(
				[
					`${s} Name: \`${message.guild.name}\``,
					`${s} Owner: ${message.guild.owner}`,
					`${s} Created at: \`${message.guild.createdAt.toDateString()}\``,
					`${s} Users: \`${message.guild.members.cache.size}\``,
					`${s} Channels: \`${message.guild.channels.cache.size}\``,
					`${s} Roles: \`${message.guild.roles.cache.size}\``,
					`${s} Recorded messages: \`${count}\``,
					'',
					`**Top words used** ${s}`,
					`${s} **${usedWordsSort[0][0]}**: \`${usedWordsSort[0][1]} times\``,
					`${s} **${usedWordsSort[1][0]}**: \`${usedWordsSort[1][1]} times\``,
					`${s} **${usedWordsSort[2][0]}**: \`${usedWordsSort[2][1]} times\``,
				].join('\n')
			)
			.setThumbnail(message.guild.iconURL({ size: 2048 }))
	);
};

exports.help = {
	name: 'serverinfo',
	aliases: [],
	description: 'shows the guilds information',
	usage: 'serverinfo',
};
