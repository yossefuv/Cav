const {
    Command
} = require('discord-akairo');

const {
    version,
     name
} = require('../../package.json');

const {
    MessageEmbed
} = require('discord.js');

class SystemConfigCommand extends Command {
    constructor() {
        super('sysconfig', {
            aliases: ['sysconfig', 'sconfig'],
            category: 'admin',
			description: { content: 'view|change system values' },
            ownerOnly: true
        });
    }

    async exec(message) {
      
        var global = await this.client.db.get('global')
        console.log(global)
        const s = '[**»**](https://google.com/)';
        const G = [`Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
        `you can configure **${this.client.user.username}** to your liking,`,
        `Note: after changing any value here a restart is required to use the new values`,
        '',
        `Type the name (bold) of these catagroies to view/change the system values ${s}`,
        '',].join('\n')



      var text = [
      `Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
      `you can configure **${this.client.user.username}** system values to your liking,`,
      '',
      `Type the name (bold) of these catagroies to view/change the system values ${s}`,
      `Note: after changing any value here a restart is required to use the new values`,
      '',
      `${s} **Message Timeout** **\`(view, change)\`**`,
      `${s} **Messag Limit** **\`(view, change)\`**`,
      '',
    ].join('\n');

    const initial = new MessageEmbed()
    .setDescription(text)
    .setTitle(`**${this.client.user.username} » Configuration**`)
    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
    .setColor(0x4dd0e1)

const msg = await message.channel.send(initial);

const filter = m => m.author.id === message.author.id;

let category = await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).catch(() =>  message.channel.send("Command timeout."));

if (!category.first()) return;
var categoryMessage = category.first();
if (category) category = category.first().content.toLowerCase();

const catagories = ['messagetimeout', 'messagelimit'];
if (!catagories.includes(category.replace(/\s/g, ''))) return message.channel.send('You did not provide a valid category!');
var index0 = catagories.indexOf(category.replace(/\s/g, ''));

var catagoriesText = [
    [
        G,
        `${s} Timeout (in seconds): \`${global.messageTimeout}\``,
        '',
        `Type in the new Timeout (in seconds) for the the bot`
    ],
    [
        G,
        `${s} Limit: \`${global.bufferLimit}\``,
        '',
        `type in the new message limit for messages`
    ],

]

  let embed = new MessageEmbed()
  .setDescription(catagoriesText[index0].join('\n'))
  .setTitle(`**${message.guild.name} » ${category.capitalize()}**`)
  .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
  .setColor(0x4dd0e1)

  categoryMessage.delete().catch(O_o => {});
  msg.edit(embed);

  let value = await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).catch(() => message.error("Command timeout."));

if (!value.first()) return;

var valueFilter = [
    {
        type: 'Number',
        path: 'messageTimeout',
    },
    {
        type: 'Number',
        path: 'bufferLimit',
    },
   
 ][index0]
var finalValue;
value = value.first();

 if (valueFilter.type === 'Number') {
    if (Number(value.content) !== NaN) {
        finalValue = Number(value.content)
    }
 }
 

if (!finalValue) return message.channel.send('Invaild input');
await this.client.db.set('global', finalValue, valueFilter.path)
message.channel.send(`Changed \`${category}\` to \`${finalValue}\``)
    }
}

String.prototype.capitalize = function () { return this.replace(/^\w/, c => c.toUpperCase()); }


module.exports = SystemConfigCommand;