import '../global';

import { LogData } from '../types/utils';

import fs from 'fs';
import path from 'path';

export const pathVariables: { [ key: string ]: string } = {
	$cwd: path.normalize(process.cwd()),
	$client: path.join(process.cwd(), 'dist/client'),
	$logs: path.join(process.cwd(), 'logs')
}

/**
 * Logs a message in the system.  
 * If `data` is a `string`, it will be registered in the default logs path.  
 * **Default Logs Path**: `$logs`  
 * - *Tip: All your logged messages will be here.*
 * ___
 * You can use **Paths Presets** inside `data.paths` to refer to a path.  
 * - **`$cwd`**: like as `process.cwd()` function;
 * - **`$client`**: `$cwd/dist/client`;
 * - **`$logs`**: `$cwd/logs` (default logs path);
 * - *Tip: You can access all Path Variables by importing `pathVariables` from this file.*
 * ___
 * @param data A `string` to log or an custom `object`.
 * @param { string } [ data.message ] A `string` to log.
 * @param { string[] } [ data.paths ] The paths list to log your `message`.
 * @param { number } [ data.timestamp ] A custom `timestamp` (date, `integer`) to set to your log.
 * @param { boolean } print Whether your `message` should be printed in the terminal.
 */
export default function log(data: LogData, print: boolean | 'raw' = false): void {
	const date = new Date(typeof data == 'string' ? Date.now() : data.timestamp || Date.now());
	const message = (typeof data == 'string' ? data : data.message).split('\n').map(l => `[ ${date.format('dd/mm/yyyy - HH:MM:SS.MS')} ] ${l}`).join('\n');
	if (print === 'raw') console.log(data);
	else if (print === true) console.log(message);
	const files = ['$logs', ...(typeof data != 'string' ? data.paths || [] : [])].map(p => {
		let file = path.normalize(Object.keys(pathVariables).includes(p) ? pathVariables[p] : p);
		if (!fs.existsSync(file) || path.parse(file).ext.length === 0) {
			if (path.parse(file).ext.length === 0) {
				fs.mkdirSync(file, { recursive: true });
				file = path.join(file, `${date.format('autolog_yyyy-mm-dd')}.txt`);
			}
			if (!fs.existsSync(file)) fs.writeFileSync(file, '', { encoding: 'utf-8' });
		}
		return file;
	});

	for (let dir of files.uniques()) {
		if (!fs.existsSync(dir) || !fs.statSync(dir).isFile()) continue;
		const fileContent = fs.readFileSync(dir, { encoding: 'utf-8' });
		const lines = fileContent.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (!/^\[ \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d.\d\d\d \]/.test(line)) continue;
			const lineTimeMatch = line.match(/\d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d.\d\d\d/);
			if (!lineTimeMatch) continue;
			const lineTime = {
				date: lineTimeMatch[0].split(' - ')[0].split('/'),
				time: lineTimeMatch[0].split(' - ')[1]
			};
			const month = lineTime.date[1];
			const day = lineTime.date[0];
			const year = lineTime.date[2];
			
			const lineDate = new Date(`${month}/${day}/${year}, ${lineTime.time}`);
			if (lineDate.valueOf() > date.valueOf()) {
				lines[i] = [ message, line ].join('\n');
				break;
			}
		}
		if (!lines.join('\n').includes(message)) lines.push(message);
		if (lines[0]?.trim() === '')
		fs.writeFileSync(dir, lines.join('\n'), { encoding: 'utf-8' });
	}
}
