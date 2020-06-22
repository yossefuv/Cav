const {
    Listener
} = require('discord-akairo');

const {
    defaultPrefix
} = require('../config.js');
const CBuffer = require('CBuffer');

const { version, name } = require('../package.json');

const settings =  {
    prefix: defaultPrefix,
    status: {
    active: true,
    type: null,

    },
    messages: {
        enabled: false,
        wordLogging: false,
         usedWords: {}, 
         count: 0,
         lastUser: 'none',
         records: {

         }
    },
    channelToLog: undefined,
    loggedChannels: [],
 };

// messageTimeout | in seconds

 const global = {
     messageTimeout: Number(process.env.MESSAGETIMEOUT),
     bufferLimit: Number(process.env.MESSAGELIMIT),
     guildSizeLimit: Number(process.env.GUILDSIZELIMIT)
 }
module.exports = class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

   async exec() {

       await this.client.logger.log(`Initializing databases...`)

        this.client.guilds.cache.map(guild => {
            if(!this.client.db.has(guild.id)) {
                this.client.db.set(guild.id,settings);
            }
            this.client.db.set(guild.id, new CBuffer(global.bufferLimit + 1) , 'messages.buffer')
        });

        await this.client.db.set('messageRecords', {});
        this.client.global = global;

        setInterval(async () => {
            var y = {};
            var z = await	Object.entries(await this.client.db.get('messageRecords'));
           if (!z.length) return;
            var x = z.filter(([key, value]) => {
              return (new Date().getTime() - value.timestap) <= this.client.global['messageTimeout']*1000; 
             });
              x.map(([key, value]) => {
                  y[key] = value;
              });
              this.client.db.set('messageRecords', y);
          }, this.client.global['messageTimeout']*1000);

        await this.client.logger.log(`Successfully initialized databases.`);


        await this.client.logger.log(`Logged in as ${this.client.user.tag} (${this.client.user.id}) in ${this.client.guilds.cache.size} server(s).`);
        await this.client.logger.log(`Version ${version} of ${name} loaded.`);

        // idk
        checkGuilds(this.client);
        setInterval(() => {
            checkGuilds(this.client);
    // end of idk

        this.client.user.setStatus('online');
        this.client.user.setActivity(`${defaultPrefix}help | ${version}`, { type: 'PLAYING' })
            .catch(err => client.logger.error(err));
        }, 3600000);
    }
}

async function checkGuilds(client) {
    client.guilds.cache.map(guild => {
        // let activeMembers = guild.members.cache.filter(m => m.presence.status !== 'offline').size;
        let activeMembers = 805
            if (activeMembers <= client.global.guildSizeLimit/2) return;
            if (activeMembers <= client.global.guildSizeLimit && activeMembers >= client.global.guildSizeLimit/2) {
               let { status } = client.db.get(guild.id);
               if (status.active === true && status.type === 'passed') return;
               client.db.set(guild.id, {
                   active: false,
                   type: 'failled'
               }, 'status')
            } else if (activeMembers > client.global.guildSizeLimit) {
    
            client.db.set(guild.id, {
                active: false,
                type: 'blacklisted'
             }, 'status')
    
          }
          });
}