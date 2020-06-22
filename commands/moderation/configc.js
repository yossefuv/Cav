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

 var settings;

class ConfigCommand extends Command {
    constructor() {
        super('config', {
            aliases: ['config', 'settings'],
            category: 'moderation',
			description: { content: 'view/change the bot settings' },
            cooldown: 2000,
            args: [
				{
                    id: 'option',
                    type: 'string'
				},
            ],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild'

        });
    }

    async exec(message, { option }) {
        settings = message.guild.get();
        
        const s = '[**»**](https://google.com/)';
        const G = [`Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
        `you can configure **${this.client.user.username}** to your liking,`,
        '',
        `Type the name (bold) of these catagroies to view/change the settings ${s}`,
        '',].join('\n')



      var text = [
      `Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
      `you can configure **${this.client.user.username}** to your liking,`,
      '',
      `Type the name (bold) of these catagroies to view/change the settings ${s}`,
      '',
      `${s} **status** **\`(view, change)\`**`,
      `${s} **Logging channel** **\`(view, change)\`**`,
      `${s} **Logged channels** **\`(view, change)\`**`,
      `${s} **Word Logging** **\`(view, change)\`**`,

      `${!settings.status.active ? settings.status.type === 'failled' ? `\n***** **${this.client.user.username}** has been disabled here, verification is required to regain functionality.`:`\n***** **${this.client.user.username}** has been permanently disabled here.` : ''}`,
    ].join('\n');

    const initial = new MessageEmbed()
    .setDescription(text)
    .setTitle(`**${message.guild.name} » Configuration**`)
    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
    .setColor(0x4dd0e1)

const msg = await message.channel.send(initial);


if (!settings.status.active) return;

const filter = m => m.author.id === message.author.id;

let category;
 await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).then((collected => category = collected)).catch(() => message.channel.send('Command timeout.'));
		
if(!category) return;
var categoryMessage = category.first();
if (category) category = category.first().content.toLowerCase();

const catagories = ['status', 'loggingchannel', 'loggedchannels', 'wordlogging'];
if (!catagories.includes(category.replace(/\s/g, ''))) return message.channel.send('You did not provide a valid category!');
var index0 = catagories.indexOf(category.replace(/\s/g, ''));

var getChannel = (ChannelID) => ChannelID ? message.guild.channels.cache.get(ChannelID) ? message.guild.channels.cache.get(ChannelID) : '\`Channel Deleted or Not found\`': `None`;
var currentChannels = message.guild.channels.cache.map(c => c.id);

var catagoriesText = [
    [
        G,
        `${s} Status: \`${settings.messages.eanbled ? "Enabled":"Disabled"}\``,
        '',
        `Type \`enable\` if you wish to enable, \`disable\` to disable`
    ],
    [
        G,
        `${s} channel: ${getChannel(settings.channelToLog)}`,
        '',
        `Type the new channel to change it`
    ],
    [
        G,
        `${s} ${
            settings.loggedChannels === currentChannels.filter(c => c !== settings.channelToLog)
            ? `All of the channels`
            : `\`${settings.loggedChannels.length}\` of the current \`${message.guild.channels.cache.size}\` channels`
        }`,
        '',
        `Type in \`all\` to add all channels and \`remove\` to remove a channel`

    ],
    [
        G,
        `${s} Status: \`${settings.messages.wordLogging ? "Enabled":"Disabled"}\``,
        '',
        `Type \`enable\` if you wish to enable, \`disable\` to disable`   
    ]
]

  let embed = new MessageEmbed()
  .setDescription(catagoriesText[index0].join('\n'))
  .setTitle(`**${message.guild.name} » ${category.capitalize()}**`)
  .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
  .setColor(0x4dd0e1)

  categoryMessage.delete().catch(O_o => {});
  msg.edit(embed);

  let value;
   await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).then((collected => value = collected)).catch(() => message.channel.send('Command timeout.'));

if (!value) return;

var valueFilter = [
    {
        type: 'Boolean',
        path: 'messages.enabled',
    },
    {
        type: 'Channel',
        path: 'channelToLog',
    },
    {
        type: 'ChannelArr',
        path: 'loggedChannels',
    },
    {
        type: 'Boolean',
        path: 'messages.wordLogging',
    }
 ][index0]
var finalValue;
value = value.first();

 if (valueFilter.type === 'Boolean') {
     switch (value.content.toLowerCase()) {
         case 'enable': case 'on': finalValue = true; break;
         case 'disable': case 'off': finalValue = false; break;
         default: finalValue = undefined;
     }
 }
 if (valueFilter.type === 'Channel') {
    finalValue = (value.mentions.channels.first() || message.guild.channels.cache.get(value.content)) || undefined;
 }

 if (valueFilter.type === 'ChannelArr') {
     let temp;
    switch (value.content.toLowerCase()) {
        case 'all': temp = true; break;
        case 'remove': temp = false; break;
        default: temp = undefined;
    } 
    if (temp === true) {

        finalValue = message.guild.channels.cache.map(c => c.id);
        if (settings.channelToLog) finalValue = finalValue.filter(c => c !== settings.channelToLog);

    } else if (temp === false) {

        let embed = new MessageEmbed()
        .setDescription('please type the channel you want to remove or \`all\` to remove all')
        .setTitle(`**${message.guild.name} » ${category.capitalize()}** »`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
      
        value.delete().catch(O_o => {});;
        msg.edit(embed);
      
        let removed;
         await message.channel.awaitMessages(filter, {
          max: 1, time: 35000, errors: ['time']
        }).then((collected => removed = collected)).catch(() => message.channel.send('Command timeout.'));
      
      if (!removed) return;
      if (removed.first().content.toLowerCase() === 'all') {
        await this.client.db.set(message.guild.id, [], valueFilter.path)
        return message.channel.send(`Removed all channels`)

      } else {
      var channel = (removed.first().mentions.channels.first() || message.guild.channels.cache.get(removed.first().content));
      if (!channel) return message.channel.send('Invaild input');
      var newChannels = settings.loggedChannels.filter(c => c !== channel.id);
      await this.client.db.set(message.guild.id, newChannels, valueFilter.path)
      return message.channel.send(`Removed ${channel} channel`) 
      }
    }
}

if (!finalValue && typeof finalValue !== 'boolean') return message.channel.send('Invaild input');
await this.client.db.set(message.guild.id, finalValue.id ? finalValue.id:finalValue, valueFilter.path)
message.channel.send(`Changed \`${category}\` to \`${finalValue.id ? finalValue.id: typeof finalValue === 'boolean' ? finalValue ? "Enabled":"Disabled": typeof finalValue === 'object' ? `${finalValue.length} channels`: finalValue}\``)
    }
}

String.prototype.capitalize = function () { return this.replace(/^\w/, c => c.toUpperCase()); }


module.exports = ConfigCommand;