const {
    Structures
} = require('discord.js');

const {
    defaultPrefix
} = require('../config.js');

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
               await this.set(this.id, {
                    prefix: defaultPrefix,
                    messages: {
                        enabled: false,
                        wordLogging: false,
                         usedWords: {}, 
                         count: 0,
                         lastUser: 'none',
                         records: {
                
                         }
                    },
                    modRole: undefined,
                    channelToLog: undefined,
                    loggedChannels: [],
                });
            }
            if(!key) return this.client.db.get(this.id);
            return this.client.db.get(this.id, key) || fallback;
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
                this.messageRecordsInterval = setInterval(async () => {
                    var y = {};
                    var z = await Object.entries(this.messageRecords);
                   if (!z.length) return;
                    var x = z.filter(([key, value]) => {
                      return (new Date().getTime() - value.timestap) <= this.client.global['messageTimeout']*1000; 
                     });
                      x.map(([key, value]) => {
                          y[key] = value;
                      });
                      this.messageRecords = y;
                  }, this.client.global['messageTimeout']*1000);
                  this.messageRecordsStatus = true;
        }
        updateRecords(message, msg) {
            if (!this.messageRecords) this.messageRecords = {};
           if (msg) {
               this.messageRecords[message.id] = { timestap: new Date().getTime(), loggedID: msg.id } 
        } else {
            this.messageRecords[message.id] = { timestap: new Date().getTime()} 
        }
        }

        async record(message, msg) {
            await this.updateRecords(message, msg);
            this.messageRecordsCheck();
        }

    }

    return GuildExt;
});