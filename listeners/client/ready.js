const { Listener } = require('discord-akairo');
const config = require('../../config.js');
const { version, name } = require('../../package.json');

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
            if(this.client.db.has(guild.id)) {
                this.client.db.delete(guild.id, "messages.buffer");
            }
        });

        this.client.global = config;

        await this.client.logger.log(`Successfully initialized databases.`);


        await this.client.logger.log(`Logged in as ${this.client.user.tag} (${this.client.user.id}) in ${this.client.guilds.cache.size} server(s).`);
        await this.client.logger.log(`Version ${version} of ${name} loaded.`);

        resetStatus(this.client);
        setInterval(() => {
          resetStatus(this.client);
        }, 3600000);

        

    }
}

function resetStatus(client) {
    client.user.setStatus('online');
       client.user.setActivity(`${config.defaultPrefix}help | ${version}`, { type: 'PLAYING' })
            .catch(err => client.logger.error(err));
    
}
