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

class BufferCommand extends Command {
    constructor() {
        super('buffer', {
            aliases: ['buffer', 'b'],
            category: 'moderation',
			description: { content: 'removes messages sent by the bot in the logging channel' },
            cooldown: 2000,
            args: [
                {
                   id: "option",
                   type: "lowercase"
                }
            ],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild'

        });
    }

    async exec(message, { option }) {
        var settings = await message.guild.get()
        , { channelToLog } = settings
        , { buffer } = settings.messages;

        if (!buffer || buffer.length === 0) return message.channel.send('the buffer is empty. Try typing something');
        var channel = message.guild.channels.cache.get(channelToLog);
        if (!channel) return message.channel.send("couldn't find the logging channel");;

        // if correct input is given
     if (option === 'all' || isNaN(option)) {
        if (option === 'all') {
           message.channel.send(new MessageEmbed()
           .setDescription(`Clearing ${buffer.length} message(s)`)
           .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
           .setColor(0x4dd0e1)).then(async (msg) => {
            await clearBuffer(channel, buffer);
            msg.edit(new MessageEmbed()
           .setDescription(`successfully cleared \`${buffer.length}\` messages in ${channel}`)
           .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
           .setColor(0x4dd0e1));
            buffer.empty();
            this.client.db.set(message.guild.id, buffer ,'messages.buffer');
           });
        } else {
          var num = Number(option);
          if (buffer.length < num) return message.channel.send(`Requested amount is larger than currant buffer size: \`${buffer.length}\``);
          message.channel.send(new MessageEmbed()
          .setDescription(`Clearing ${num} message(s)`)
          .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
          .setColor(0x4dd0e1)).then(async (msg) => {
            await clearBuffer(channel, buffer, num);
            msg.edit(new MessageEmbed()
            .setDescription(`successfully cleared \`${num}\` messages in ${channel}`)
            .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
            .setColor(0x4dd0e1));
            buffer.slice(buffer.length - num, buffer.length);
            this.client.db.set(message.guild.id, buffer ,'messages.buffer');
           });

        }

    // if no invaild input was given
     } else {
        const s = '[**»**](https://google.com/)';
        const initial = new MessageEmbed()
        .setDescription([
            `Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
            `${s} buffer size limit: \`${settings.messages.bufferLimit}\``,
            `${s} current buffer size: \`${buffer.length}\``,
            `${s} current buffer status: \`${settings.messages.bufferLimit <= buffer.length ? 'Deleting oldest message when a new message is sent':'Noting'}\``,
            '',
            `Type the number of messages you want delete(deletes from oldest) or 'all' to delete all messages`
        ])
        .setTitle(`**${message.guild.name} » Buffer**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
    const msg = await message.channel.send(initial);
    const filter = m => m.author.id === message.author.id;
    
    let answer;
     await message.channel.awaitMessages(filter, {
        max: 1, time: 35000, errors: ['time']
    }).then((collected => answer = collected)).catch(() => message.channel.send('Command timeout.'));
            
    if(!answer) return;
    var answerMessage = answer.first();
    if (answer) answer = answer.first().content.toLowerCase();
    if (answer === 'all') {
        answerMessage.delete().catch(O_o => {});
        msg.edit(new MessageEmbed()
        .setDescription(`Clearing ${buffer.length} message(s)`)
        .setTitle(`**${message.guild.name} » Buffer**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)).then(async (msg1) => {
         await clearBuffer(channel, buffer);
         msg1.edit(new MessageEmbed()
        .setDescription(`successfully cleared \`${buffer.length}\` messages in ${channel}`)
        .setTitle(`**${message.guild.name} » Buffer**`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1));
         buffer.empty();
         this.client.db.set(message.guild.id, buffer ,'messages.buffer');
        });
    } else if (!isNaN(answer)) {
        var num = Number(answer);
        if (buffer.length < num) return message.channel.send(`Requested amount is larger than currant buffer size: \`${buffer.length}\``);
        answerMessage.delete().catch(O_o => {});
        msg.edit(new MessageEmbed()
        .setDescription(`Clearing ${num} message(s)`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setTitle(`**${message.guild.name} » Buffer**`)
        .setColor(0x4dd0e1)).then(async (msg1) => {
          await clearBuffer(channel, buffer, num);
          msg1.edit(new MessageEmbed()
          .setDescription(`successfully cleared \`${num}\` messages in ${channel}`)
          .setTitle(`**${message.guild.name} » Buffer**`)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
          .setColor(0x4dd0e1));
          buffer.slice(buffer.length - num, buffer.length);
          this.client.db.set(message.guild.id, buffer ,'messages.buffer');
         });
    } else return message.channel.send(`Invaild input`);

     }

var clearBuffer = async (channel, buffer, number = 'all') => {
    if (number === 'all') {
        await buffer.forEach(async (m) => {
            var buffMsg = await channel.messages.cache.get(m);
            if (!buffMsg) return;
            buffMsg.delete().catch(O_o => {});
        });
    } else if (!isNaN(number)) {
        for (var i = 0; i < Number(num); i++) {
            var msgID = await buffer.shift()
            , msg = await channel.messages.cache.get(msgID);
                  if (!msg) return;
                  msg.delete().catch(O_o => {});
          }
    } else new Error('iNVAILD INPUT')
}


    }
}



module.exports = BufferCommand;