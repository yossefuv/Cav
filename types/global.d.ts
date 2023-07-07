import { Client, Collection, Guild } from 'discord.js';
import enmap from "enmap";
declare global {
    interface cClient extends Client {
        commands?: Collection<string, any>;
        cooldowns?: Collection<string, any>;
        commandCategories?: Array<object, any>;
        db?: enmap<any, any>;
        config?: Object<object, any>;
    }

    interface cGuild extends Guild {
        lastUser?: String<string,any>;
        messageRecordsStatus?: Boolean<any>;
        messageRecordsInterval? : any;
        messageRecords?: Object<object, any>;
    }
}
