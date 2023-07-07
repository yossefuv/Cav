import { Client, Collection } from 'discord.js';

declare global {
    interface cClient extends Client {
        commands?: Collection<string, any>;
        cooldowns?: Collection<string, any>;
        commandCategories?: Array<object, any>;
    }
}
