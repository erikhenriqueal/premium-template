import dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
export const client = new Discord.Client({ intents: Object.values(Discord.Intents.FLAGS) });

client.login(process.env.token)
	.catch(error => console.error(`[ Discord - Client ] Could not login: ${error}`));
