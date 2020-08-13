const { Structures } = require('discord.js');
const { defaultPrefix } = require('../config.js');
const CBuffer = require('CBuffer');

Structures.extend('Guild', Guild => {
    class GuildExt extends Guild {
        constructor(...args) {
            super(...args);
        }

        // Returns the Guild prefix
        // <Guild>.prefix
        get prefix() {
            return this.get('prefix', defaultPrefix);
        }

        // The following methods are all namespaced by Guild ID.
        // Examples:
        // <Guild>.get('loggingChannelID', [fallback]);
        // <Guild>.set('loggingChannelID', '383430486506340352')
       async get(key, fallback) {
            if (!this.client.db.has(this.id)) {
               await this.client.db.set(this.id, {
                    prefix: defaultPrefix,
                    messages: {
                        enabled: false,
                        lifetime:  this.client.global.defaultMessageLifetime,
                        bufferLimit:  this.client.global.defaultBufferLimit,
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
            if(!key) return await this.client.db.get(this.id);
            return await this.client.db.get(this.id, key) || fallback;
        }

        set(key, data) {
            return this.client.db.set(this.id, key, data);
        }

        delete(key) {
            return this.client.db.delete(this.id, key);
        }

        updateLastUser(message, custom) {
            if (custom) return this.lastUser = custom;
            return this.lastUser = `${message.channel.id}.${message.author.id}`;
        }

        messageRecordsCheck() {
            if (this.messageRecordsStatus) return;
            var { lifetime } = this.get('messages');
             this.messageRecordsInterval = setInterval(async () => {
                    var y = {};
                    var z = await Object.entries(this.messageRecords);
                   if (!z.length) return;
                    var x = z.filter(([key, value]) => {
                      return (new Date().getTime() - value.timestap) <= lifetime*6e4; 
                     });
                      x.map(([key, value]) => {
                          y[key] = value;
                      });
                      this.messageRecords = y;
                  }, lifetime*6e4);
                  this.messageRecordsStatus = true;
        }
        updateRecords(message, msg) {
            if (!this.messageRecords) this.messageRecords = {};
               this.messageRecords[message.id] = { timestap: new Date().getTime(), loggedID: msg.id } 

        }

        async record(message, msg) {
            await this.updateRecords(message, msg);
            this.messageRecordsCheck();
        }

        async log(message, text, channel) {

            var settings = await this.get();

    // sends the filtered message in the format '#CHANNEL USER: MESSAGE' OR '#CHANNEL ... MESSAGE'
    channel.send(text).then(async (msg) => {
        this.record(message, msg);
       // check the buffer limit in the server
        var buffer = await this.get('messages.buffer', new CBuffer(settings.messages.bufferLimit + 1));
        var limit = await this.get('messages.bufferLimit');
        var length = await buffer.push(msg.id);

        if (length > limit) {
          var oldValue = await buffer.shift();
          var oldMsg = await channel.messages.cache.get(oldValue);
          if (!oldMsg) return;
          oldMsg.delete().catch(O_o => {});
        }
        this.client.db.set(this.id, buffer, 'messages.buffer')

    });
  }

     async changeMessageLifetime (newTime) {
         if (typeof newTime !== 'number') return;
        var settings = await this.get();
        var buffer = settings.messages.buffer;
        var channel = await this.channels.cache.get(settings.channelToLog);
        if (settings.messages.lifetime === newTime) return;

        if (buffer && channel) {

            buffer.forEach(async (m) => {
                var message = channel.messages.cache.get(m);
                if (!message) return;

                message.delete().catch(O_o => {});
            });
            this.client.db.set(this.id, new CBuffer(settings.messages.bufferLimit +1), 'messages.buffer');
        }
        clearInterval(this.messageRecordsInterval);
        this.messageRecordsStatus = false;
        this.messageRecords = {};
        this.messageRecordsCheck()
     }

     async changeBufferLimit (newLimit) {
        if (typeof newLimit !== 'number') return;

        var settings = await this.get()
        , buffer = await this.get('messages.buffer', null)
        , channel = await this.channels.cache.get(settings.channelToLog);
        if (settings.messages.bufferLimit === newLimit) return;

        if (buffer && channel) {

            buffer.forEach(async (m) => {
                var message = channel.messages.cache.get(m);
                if (!message) return;

                message.delete().catch(O_o => {});
            });
        }
        this.client.db.set(this.id, new CBuffer(newLimit+1), 'messages.buffer');

     }

 }

    return GuildExt;
});