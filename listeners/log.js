const {
    Listener
} = require('discord-akairo');

const CBuffer = require('CBuffer');

module.exports = class ReadyListener extends Listener {
    constructor() {
        super('log', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {

        if (!message.guild || message.author.bot) return;

        LogMsg(this.client, message)

    }
}

async function LogMsg(client, message) {
    var settings = message.guild.get();
    var global = client.db.get('global');

    if (!settings.messages.enabled) return;
    
    if (settings.messages.wordLogging) {
		let { usedWords, count } = settings.messages;
        
        //	let temp =// await commonRemover.remove(message.content.toLowerCase())
            let temp = await message.content.toLowerCase().replace(/[^\w\s]+/gi, '');
             temp = await temp.replace(/(\b(\w{1,3})\b(\W|$))/gi, '');

		   const msgArr = temp.split(' ');
			await msgArr.map(w => {
                if(w == '') return;
				usedWords[w] ? (usedWords[w] += 1) : (usedWords[w] = 1);
			});
			client.db.set(message.guild.id, usedWords, 'messages.usedWords');
			client.db.set(message.guild.id, (count += 1), 'messages.count');
    }

	     if (settings.loggedChannels.includes(message.channel.id) && settings.channelToLog !== message.channel.id) {
			const Cmd = message.content.slice(settings.prefix.length).trim().split(/ +/g).shift().toLowerCase();
			const vaildCmd = client.commandHandler.modules.get(Cmd) || client.commandHandler.aliases.get(Cmd);
            if (vaildCmd && message.member.permissions.has('ADMINISTRATOR')) return;
            
			if (!settings.channelToLog) return;
            const channel = message.guild.channels.cache.get(settings.channelToLog);
            
			channel.send(`${message.channel} ${settings.messages.lastUser === `${message.channel.id}.${message.author.id}` ? '...' : `\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:`} ${message.content}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
				client.db.set(message.guild.id, `${message.channel.id}.${message.author.id}`, 'messages.lastUser');
                client.db.set('messageRecords', { timestap: new Date().getTime(), loggedID: msg.id }, message.id);
                var buffer = message.guild.get('messages.buffer', new CBuffer(global.bufferLimit + 1))
                var length = await buffer.push(msg.id);

                if (length > global.bufferLimit) {
                  var oldValue = await buffer.shift();
                  var oldMsg = await channel.messages.cache.get(oldValue);
                  oldMsg.delete().catch(O_o => {});
                }
                client.db.set(message.guild.id, buffer, 'messages.buffer')

			});

 }
}