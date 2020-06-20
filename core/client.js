const path = require('path');
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler
} = require('discord-akairo');
const {
    ownerID,
    defaultPrefix
} = require('../config.js');
const db = require('enmap');
const Utils = require('./utils.js');

require('../structures/Guild.js');
require('../structures/GuildMember.js');

module.exports = class GuardianClient extends AkairoClient {
    constructor() {
        super({
            ownerID,
        }, {
            disableEveryone: true
        })

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands/'),
            prefix: message => message.guild ? message.guild.prefix : defaultPrefix,
            aliasReplacement: /-/g,
            allowMention: true,
			fetchMembers: true,
			commandUtil: true,
			commandUtilLifetime: 3e5,
			commandUtilSweepInterval: 9e5,
			handleEdits: true,
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });

		this.db = new db({ name: 'storage' });
        this.Utils = new Utils(this);
        this.logger = require('./logger');

    }

    async login(token) {
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        return super.login(token);
    }

}