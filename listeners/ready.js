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
     messageTimeout: 180,
     bufferLimit: 500,
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
       if (this.client.db.has('global')) {
        await this.client.db.set('global', global)
       }       
       var gg = this.client.db.get('global') || global;

        setInterval(async () => {
            var y = {};
            var z = await	Object.entries(await this.client.db.get('messageRecords'));
           if (!z.length) return;
            var x = z.filter(([key, value]) => {
              return (new Date().getTime() - value.timestap) <= gg['messageTimeout']*1000; 
             });
              x.map(([key, value]) => {
                  y[key] = value;
              });
              this.client.db.set('messageRecords', y);
          }, gg['messageTimeout']*1000);

        await this.client.logger.log(`Successfully initialized databases.`);


        await this.client.logger.log(`Logged in as ${this.client.user.tag} (${this.client.user.id}) in ${this.client.guilds.cache.size} server(s).`);
        await this.client.logger.log(`Version ${version} of ${name} loaded.`);

        this.client.user.setStatus('online');
        this.client.user.setActivity(`${defaultPrefix}help | ${version}`, { type: 'PLAYING' })
            .catch(err => client.logger.error(err));
    }
}