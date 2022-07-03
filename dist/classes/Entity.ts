import '../global';

import {
  EntityCallback,
  EntityCommand,
  EntityEvents,
  EntityEvent,
  EntityKillCodes
} from '../types/entity';
import cp from 'child_process';
import path from 'path';
import { log } from '../utils';

export default class Entity {
  public static list: Entity[] = [];
  public static killCodesReason: EntityKillCodes = {
    4000: 'UNKNOW',
    4001: 'RELOAD_ATTEMPTIES_EXCEEDED'
  }

  private reloadAttempties: number = 0;
  private avearageReloadTime: number = 0;
  private firstReloadTimestamp: number = 0;
  private _killed: boolean = false;
  private _killCode: keyof EntityKillCodes | null = null;
  private callback?: EntityCallback;
  private events: EntityEvent<keyof EntityEvents>[] = [];
  private emit<N extends keyof EntityEvents>(eventName: N, ...args: EntityEvents[N]): this {
    for (const event of this.events.filter(e => e.name === eventName)) {
      event.callback(...args);
    }
    return this;
  }
  private setup(): void {
    this.process = cp.exec(this.executionCommand, { cwd: this.cwd });
    this.process?.on('spawn', () => {
      this.emit('spawn');
			if (!this.allowDefaults) return;
      log(`[ Entity - ${this.name} ] Process "${this.name}" (command: ${this.executionCommand}) was spawned.`, 'raw');
    });
    this.process?.on('error', (error: string) => {
      this.emit('error', error);
      if (this.callback) this.callback(error, null, null);
			if (!this.allowDefaults) return;
      log(`[ Entity - ${this.name} ] Process "${this.name}" (command: ${this.executionCommand}) emitted an error:`, 'raw');
      log(error, 'raw');
			if (!this.reloadable) return;
			if (this.reloadSignals.length > 0 && !this.reloadSignals.includes(error)) return;
			if (this.reloadSignalsExceptions.includes(error)) return;
			return this.reload(5);
    });
    this.process?.on('exit', (code, signal: string) => {
      code = code || 1;
      this.emit('exit', code, signal);
      if (this.callback) this.callback(null, code, null);
			if (!this.allowDefaults) return;
      log(`[ Entity - ${this.name} ] ${Object.keys(Entity.killCodesReason).includes(`${code}`) ? `${Entity.killCodesReason[code as keyof EntityKillCodes].toUpperCase()}: ` : ''}Process "${this.name}" (command: ${this.executionCommand}) exited with code ${code}.`, 'raw');
			if (!this.reloadable) return;
			if (this.reloadSignals.length > 0 && !this.reloadSignals.some(s => [signal, code].includes(s))) return;
			if (this.reloadSignalsExceptions.some(s => [signal, code].includes(s))) return;
			return this.reload(5);
    });
    this.process?.stderr?.on('data', (data: string) => {
      this.emit('data', data);
      this.emit('stderr_data', data);
      data = data.trim();
      if (this.callback) this.callback(null, null, data);
      return log(`[ Entity - ${this.name} ] ${data}`, 'raw');
    });
    this.process?.stdout?.on('data', (data: string) => {
			this.emit('data', data);
      this.emit('stdout_data', data);
      data = data.trim();
      if (this.callback) this.callback(null, null, data);
			if (!this.allowDefaults) return;
      return log(`[ Entity - ${this.name} ] ${data}`, 'raw');
    });
  }

  /** The command to run your process. */
  public executionCommand: string;
  /**
	 * The name of your Entity.  
	 * If there's 2 or more Entities with the same name, the lasts created will be enumerated with `_id` on their ends.  
	 * Default `Unknow`.
	 */
  public name: string = 'Unknow';
  /** The current working directory of your process. */
  public cwd: string = process.cwd();
  /** Whether the Entity should automaticaly reload on `error` or `exit`. Default `false` */
  public reloadable: boolean = false;
  /** List of signals that when emitted will reload your application. Not string or number arguments will be ignored. Ignored if `this.readable` is `false`. */
  public reloadSignals: (string | number)[] = [];
  /** List of signals to ignore in `reloadable` parameter. Not string or number arguments will be ignored. Ignored if `this.readable` is `false`. */
  public reloadSignalsExceptions: (string | number)[] = [];
  /** The raw process created. */
  public process?: cp.ChildProcess;
	/** Whether your `spawn`, `error`, `exit` and `data` events should be executed before your `callback`. Default `true`.*/
	public allowDefaults: boolean = true;
  /** Whether your process is killed or not. */
  public get killed(): boolean {
    return this._killed;
  }
  /** The reason to the kill of this Entity. */
  public get killCode(): keyof EntityKillCodes | null {
    return this._killCode;
  }
  /** A simple event emitter. */
  public on<N extends keyof EntityEvents>(eventName: N, listener: (...args: EntityEvents[N]) => void): this {
    this.events.push({ name: eventName, callback: listener });
    return this;
  }
  /**
	 * Try to reload your process. If there's 3 *irregular reload attempties*, the process is **killed**.
	 * @param { number } timeout A time in seconds to reload the process.
	 * */
  public reload(timeout: number = 0): void {
		log(`[ Entity - ${this.name} ] Reloading${timeout > 0 ? ` in ${timeout.toLocaleString('br')} second${timeout === 1 ? '' : 's'}` : ''}...`, 'raw');
		setTimeout(() => {
			this.kill();
			if (this.reloadAttempties === 3) {
				if (this.avearageReloadTime < 30e3) return;
				else {
					this.reloadAttempties = 0;
					this.avearageReloadTime = 0;
					this.firstReloadTimestamp = 0;
				}
			}
			if (this.firstReloadTimestamp === 0) this.firstReloadTimestamp = Date.now();
			this.avearageReloadTime = (this.avearageReloadTime + Date.now()) / this.reloadAttempties;
			this.reloadAttempties++;
			this.setup();
		}, timeout);
  }
  /** Stops definitely your subprocess execution. */
  public kill(signal?: keyof EntityKillCodes): boolean {
    try {
      if (this.killed) return true;
      const killed = this.process?.kill() || false;
      if (!killed) throw new Error('PROCESS_NOT_KILLED');
      this._killed = true;
      this._killCode = signal || 4000;
      delete this.process;
      return true;
    } catch(error) {
      log(`[ Entity - ${this.name} ] Process "${this.name}@${this.process?.pid || 'null'}" (command ${this.executionCommand}) could not be killed.`, 'raw');
      return false;
    }
  }

	/**
	 * Creates a new subprocess using `child_process`.  
	 * Entities is the main class of our app. All systems here are created using this.  
	 * The great side of doing it is that you can make unique systems that will be able to `reload` in case of a failure or break out and make your system look like... Unbreakable!
	 * @param command A command or options to create your Entity.
	 * @param callback A function to be called every time you process emit a event like `error`, `exit`, `stderr data` or `stdout data`.
	 */
  constructor(command: EntityCommand, callback?: EntityCallback) {
    if (typeof command === 'string') this.executionCommand = command.trim();
    else {
      this.executionCommand = command.command;
      this.name = command.name?.trim() || this.name;
      this.cwd = path.normalize(command.cwd || this.cwd);
      this.reloadable = command.reloadable || false;
      this.reloadSignals = command.reloadSignals?.filter(s => ['string', 'number'].includes(typeof s)) || [];
      this.reloadSignalsExceptions = command.reloadSignalsExceptions?.filter(s => ['string', 'number'].includes(typeof s)) || [];
			this.allowDefaults = command.allowDefaults || true;
    }
		const similars = Entity.list.filter(e => new RegExp(`${this.name}(?:_[\d]+)?`).test(e.name));
    if (similars.length > 0) {
			const names = similars.map(e => e.name);
			const ids = names.map(n => {
				const cleanName = n.slice(0, n.length - n.split('').reverse().indexOf('_'));
				return Number(n.slice(cleanName.length)) || 0;
			}).sort((a, b) => b - a);
			this.name = `${this.name}_${ids[0] + 1}`;
    }
    this.callback = callback;
    this.setup();
    Entity.list.push(this);
  }
}
