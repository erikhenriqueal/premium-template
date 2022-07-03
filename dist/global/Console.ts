import './types';
import { client } from '../client';

console.say = function(this: Console, ...args: any[]) {
	const botname = client.user?.username || 'DiscordJS';
	return console.log(`${botname}:`, ...args);
}
