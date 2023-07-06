import { regCMD } from "../deploy-commands";
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: any) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        regCMD(client.user.id)
	},
};
