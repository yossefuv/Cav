import { Client, Events } from "discord.js";
import { regCMD } from "../deploy-commands";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        regCMD(client.user.id)
	},
};
