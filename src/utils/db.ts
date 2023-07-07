import { Message, TextChannel } from "discord.js";
const CBuffer = require('CBuffer');

export async function dget(client: cClient, guild: cGuild, key?: string, fallback?: any) {
    if (!client.db.has(guild.id)) {
        await client.db.set(guild.id, {
             messages: {
                 enabled: false,
                 lifetime:  client.config.defaultMessageLifetime,
                 bufferLimit:  client.config.defaultBufferLimit,
                 wordLogging: false,
                  usedWords: {}, 
                  count: 0,
                  lastUser: 'none',
             },
             modRole: undefined,
             channelToLog: undefined,
             loggedChannels: [],
         });
     }
     if(!key) return await client.db.get(guild.id);
     return await client.db.get(guild.id, key) || fallback;
}

export function dset(client: cClient, guild: cGuild, key: string, data: any) {
    return client.db.set(guild.id, key, data);
}

export function ddelete(client: cClient, guild: cGuild, key: string) {
    return client.db.delete(guild.id, key);
}

export function updateLastUser(client: cClient, guild: cGuild, message: Message, custom?: boolean) {
    if (custom) return guild.lastUser = custom;
    return guild.lastUser = `${message.channel.id}.${message.author.id}`;
} 

export async function messageRecordsCheck(client: cClient, guild: cGuild) {
    if (guild.messageRecordsStatus) return;
    var { lifetime } = await dget(client, guild, 'messages');
     guild.messageRecordsInterval = setInterval(async () => {
            var y = {};
            var z = Object.entries(guild.messageRecords);
           if (!z.length) return;
            var x = z.filter(([key, value]:any) => {
              return (new Date().getTime() - value.timestap) <= lifetime * 6e4; 
             });
              x.map(([key, value]) => {
                  y[key] = value;
              });
              guild.messageRecords = y;
          }, lifetime * 6e4);
          guild.messageRecordsStatus = true;
}

// msg is the of the message sent by the bot
export async function updateRecords(client: cClient, guild: cGuild, message: Message, msg: Message) {
    if (!guild.messageRecords) guild.messageRecords = {};
    guild.messageRecords[message.id] = { timestap: new Date().getTime(), loggedID: msg.id } 
}

export async function record(client: cClient, guild: cGuild, message: Message, msg: Message) {
    await updateRecords(client, guild, message, msg);
    await messageRecordsCheck(client, guild);
}

export async function log(client: cClient, guild: cGuild, message: Message, text: string, channel: TextChannel) {

    var settings = await dget(client, guild);
    console.log(channel)
    // sends the filtered message in the format '#CHANNEL USER: MESSAGE' OR '#CHANNEL ... MESSAGE'
    channel.send(text).then(async (msg) => {
    record(client, guild, message, msg);
    // check the buffer limit in the server
    var buffer = await dget(client, guild, 'messages.buffer', new CBuffer(settings.messages.bufferLimit + 1));
    var limit = await dget(client, guild, 'messages.bufferLimit');
    var length = await buffer.push(msg.id);
    
    if (length > limit) {
      var oldValue = await buffer.shift();
      var oldMsg = await channel.messages.cache.get(oldValue);
      if (!oldMsg) return;
      oldMsg.delete().catch(O_o => {});
    }
    client.db.set(guild.id, buffer, 'messages.buffer')
    
    });

}

export async function changeMessageLifetime(client: cClient, guild: cGuild, newTime: number) {

var settings = await dget(client, guild);
var buffer = settings.messages.buffer;
var channel = await client.channels.fetch(settings.channelToLog);
if (settings.messages.lifetime === newTime) return;

if (buffer && channel) {

    buffer.forEach(async (m: any) => {
        //@ts-ignore
        var message = channel.messages.cache.get(m);
        if (!message) return;

        message.delete().catch((O_o: any) => {});
    });
    client.db.set(guild.id, new CBuffer(settings.messages.bufferLimit +1), 'messages.buffer');
}
clearInterval(guild.messageRecordsInterval);
guild.messageRecordsStatus = false;
guild.messageRecords = {};
messageRecordsCheck(client, guild);

}

export async function changeBufferLimit(client: cClient, guild: cGuild, newLimit: number) {

    var settings = await dget(client, guild)
    , buffer = await dget(client, guild, 'messages.buffer', null)
    , channel = await client.channels.fetch(settings.channelToLog);
    if (settings.messages.bufferLimit === newLimit) return;

    if (buffer && channel) {

        buffer.forEach(async (m) => {
            //@ts-ignore
            var message = channel.messages.cache.get(m);
            if (!message) return;

            message.delete().catch(O_o => {});
        });
    }
    client.db.set(guild.id, new CBuffer(newLimit+1), 'messages.buffer');

}


/* <ref *1> Message {
    channelId: '1117933912879022183',
    guildId: '1117933911654289542',
    id: '1126972564867125259',
    createdTimestamp: 1688761597602,
    type: 0,
    system: false,
    content: 'wad',
    author: User {
      id: '191615236363649025',
      bot: false,
      system: false,
      flags: UserFlagsBitField { bitfield: 4194432 },
      username: 'yossaf',
      discriminator: '0',
      avatar: 'a7b542604e40a9fd3571dc6309ce24ef',
      banner: undefined,
      accentColor: undefined
    },
    pinned: false,
    tts: false,
    nonce: '1126972563293995008',
    embeds: [],
    components: [],
    attachments: Collection(0) [Map] {},
    stickers: Collection(0) [Map] {},
    position: null,
    roleSubscriptionData: null,
    editedTimestamp: null,
    reactions: ReactionManager { message: [Circular *1] },
    mentions: MessageMentions {
      everyone: false,
      users: Collection(0) [Map] {},
      roles: Collection(0) [Map] {},
      _members: null,
      _channels: null,
      _parsedUsers: null,
      crosspostedChannels: Collection(0) [Map] {},
      repliedUser: null
    },
    webhookId: null,
    groupActivityApplication: null,
    applicationId: null,
    activity: null,
    flags: MessageFlagsBitField { bitfield: 0 },
    reference: null,
    interaction: null
  } */
  