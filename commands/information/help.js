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
    ownerID,
    defaultPrefix: prefix 
} = require('../../config.js');

 var settings;

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'information',
			description: { content: 'see commands the bot has to offer' },
            cooldown: 2000,
            args: [
				{
                    id: 'option',
                    type: 'string'
				},
            ],

        });
    }

    async exec(message, { option }) {
        settings = message.guild ? message.guild.get() : { prefix }
        const s = '[**»**](https://google.com/)';

     if (option) {
      if (this.client.commandHandler.categories.get(option)) {
          var category = this.client.commandHandler.categories.get(option);
          if (category.id === 'admin' && ownerID !== message.author.id) return message.channel.send(`You need to be the bot developer to view this category`)

        let embed = new MessageEmbed()
        .setDescription([
            `View help information for ${this.client.user}`,
            `Do ${settings.prefix}help <command> for specific help information ${s}`,
            '',
            `**${category.id}** ${s}`,
            `${category.map(c => `\`${c.id}\``).join(' | ')}`
        ])
        .setTitle(`**${this.client.user.username} » Help**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
    
    return message.channel.send(embed);
      }
      if (this.client.commandHandler.modules.get(option) || this.client.commandHandler.aliases.get(option)) {
        var command = this.client.commandHandler.modules.get(option) || this.client.commandHandler.aliases.get(option);
        if (command.ownerOnly && ownerID !== message.author.id) return message.channel.send(`You need to be the bot developer to view this command`)
        let embed = new MessageEmbed()
        .setDescription([
            `View help information for ${this.client.user}`,
            `Do ${settings.prefix}help <command> for specific help information ${s}`,
            '',
            `**${command.id}** ${s}`,
            `${s} name: \`${command.id}\``,
            `${s} aliases: ${command.aliases.map(c => `\`${c}\``).join(' | ')}`,
            `${s} description: \`${command.description.content}\``,
            `${s} category: \`${command.categoryID}\``,
            `${s} Guild only?: \`${command.channel === 'guild' ? "Yes":"No"}\``,
            `${command.ownerOnly ? `${s} ownerOnly?: \`Yes\``: ''}`

        ])
        .setTitle(`**${this.client.user.username} » Help » ${command.id}**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
        return message.channel.send(embed);
      }
     } else {
      var catagroiess = await this.client.commandHandler.categories.map(c => c.id);
      if (ownerID !== message.author.id) catagroiess = catagroiess.filter(c => c !== 'admin')
        var text = [
            `View help information for ${this.client.user}`,
            `Do ${settings.prefix}help <command> for specific help information ${s}`,
            '',
            `${message.channel.type === 'dm' ? `Type ${settings.prefix}help <category> to see the commands ${s}` : `Type the name (bold) of these catagroies to view the category ${s}`}`,
            '',
            `${catagroiess.map(c => `${s} **${c}**`).join('\n')}`,
            '',
          ].join('\n');
          const initial = new MessageEmbed()
          .setDescription(text)
          .setTitle(`**${this.client.user.username} » Help**`)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
          .setColor(0x4dd0e1)
      
          const msg = await message.channel.send(initial);

       if (message.channel.type === 'dm') return;
       const filter = m => m.author.id === message.author.id;

       let categoryval;
        await message.channel.awaitMessages(filter, {
          max: 1, time: 35000, errors: ['time']
        }).then((collected => categoryval = collected)).catch(() => message.channel.send('Command timeout'));
      

       if (!categoryval) return;
       var categoryMessage = categoryval.first();
       if (categoryval) categoryval = categoryval.first().content.toLowerCase();
       
       if (!catagroiess.includes(categoryval.replace(/\s/g, ''))) return message.channel.send('You did not provide a valid category!');

       var categoryend = this.client.commandHandler.categories.get(categoryval);

     let embed = new MessageEmbed()
     .setDescription([
         `View help information for ${this.client.user}`,
         `Do ${settings.prefix}help <command> for specific help information ${s}`,
         '',
         `**${categoryend.id}** ${s}`,
         `${categoryend.map(c => `\`${c.id}\``).join(' | ')}`
     ])
     .setTitle(`**${this.client.user.username} » Help**`)
     .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
     .setColor(0x4dd0e1)

     categoryMessage.delete().catch(O_o => {});
     return msg.edit(embed)
     }


    }
}

String.prototype.capitalize = function () { return this.replace(/^\w/, c => c.toUpperCase()); }


module.exports = HelpCommand;