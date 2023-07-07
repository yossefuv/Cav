/* /* console.log(Math.floor(10.5));

let namse: string = "Elzero";
let numberc: number = 5;
let bols: boolean = true;

let obk: object = {};
let obka = ["aw","wa"]; */
/*
@name acc:
*//*
let acc = (_owka: any, lwad?: any ,wad?: any): string => {
return "a";
}
acc("s")

interface User {
    id: number,
    hired: boolean,
    name: string,
    country: string,
}
//@ts-ignore
class myUser implements User {
    id: number;
    hired: boolean;
    name: string;
    country: string;
    
    constructor (id: number, hired: boolean, name: string, country: string) {
        this.id = id;
        this.hired = hired;
        this.name = name;
        this.country = country;
    }


}

const user: User = {
    id: 6156,
    hired: false,
    name: "mah",
    country: "eg"
} */

import fs from 'node:fs';
import path from 'node:path';
import db from 'enmap';
import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config(); 

console.log("Bot is starting...");

const client: cClient = new Client({
    intents: [GatewayIntentBits.Guilds,
		 GatewayIntentBits.GuildMembers,
		 GatewayIntentBits.MessageContent,
		 GatewayIntentBits.GuildMessages],
});


client.commands = new Collection();
client.cooldowns = new Collection();
client.db = new db({name: "maindb"});
client.config = require("./config");

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
client.commandCategories = {};
commandFolders.forEach((c) => client.commandCategories[c] = {})
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commandCategories[command.category][command.data.name] = {
				name: command.data.name,
				description: command.data.description,
			}
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'listeners');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args: any) => event.execute(client,...args));
	} else {
		client.on(event.name, (...args: any) => event.execute(client,...args));
	}
}


/* 
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} 
}); */

client.login(process.env.TOKEN);
