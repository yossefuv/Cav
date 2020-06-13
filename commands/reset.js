const { MessageEmbed } = require('discord.js');
var settings;

exports.run = async (client, message, args) => {
    settings = client.db.get(message.guild.id);

    var resetEmbed = new MessageEmbed()
    .setTitle(`**${message.guild.name} » Reset**`)
    .setDescription(
        `Are you sure you want to reset this guild's configuration.\n**Type:** \`Yes\` to reset and \`No\` to cancel`
    )
    .setFooter(`~`, message.guild.iconURL({ size: 2048 }));

let msg = await message.channel.send(resetEmbed);

const filter = m => m.author.id === message.author.id;
let reset = await message.channel
    .awaitMessages(filter, {
        max: 1,
        time: 35000,
        errors: ['time'],
    })
    .catch(() => message.channel.send('Command timeout.'));

if (!reset) return;

const resetMessage = reset.first();
if (reset) reset = reset.first().content.toLowerCase();

resetMessage.delete().catch(() => {});
if (reset === 'no') {
    return msg.edit(
        new MessageEmbed()
            .setTitle(`**${message.guild.name} » Reset**`)
            .setDescription(`canceled the reset process`)
            .setFooter(`~`, message.guild.iconURL({ size: 2048 }))
    );
} else if (reset === 'yes') {

client.db.set(message.guild.id, {
    channelToLog: undefined,
    preferences: {
     mention: false,
     removeCommonWords: true,
    },
    messages: {
         usedWords: settings.messages.usedWords, 
         count: settings.messages.count,
         lastUser: 'none'
    },
    loggedChannels: [],
    enabled: false
 });

return msg.edit(
    new MessageEmbed()
    .setTitle(`**${message.guild.name} » Reset**`)
    .setDescription(`successfully reseted this guild's configuration`)
        .setFooter(`~`, message.guild.iconURL({ size: 2048 }))
);
} else return message.channel.send(`You did not provide a valid option!`);


};

exports.help = {
	name: 'reset',
	aliases: [],
	description: `reset guild's database`,
	usage: 'reset',
};
