const {
    Command
} = require('discord-akairo');

const {
     MessageEmbed
 } = require('discord.js');
 
 const {
      version,
       name
 } = require('../../package.json');

 
 const {
    ownerID
} = require('../../config.js');

 var settings;

class InfoCommand extends Command {
    constructor() {
        super('info', {
            aliases: ['info'],
            category: 'information',
			description: { content: 'see info about the bot' },
            cooldown: 2000,

        });
    }

    async exec(message) {
        settings = message.guild.get();
        const s = '[**»**](https://google.com/)';


        let embed = new MessageEmbed()
        .setDescription([
            `${s} **${name}** version \`${version}\` was made by ${this.client.users.cache.get('191615236363649025')} \`(xYossaf)\``,

        ])
        .setTitle(`**${this.client.user.username} » Info**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
    
    return message.channel.send(embed);
   

    }
}



module.exports = InfoCommand;