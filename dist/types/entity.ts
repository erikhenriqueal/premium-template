export interface EntityCommandData {
	/** The command to run your process. */
  command: string;
	/**
	 * The name of your Entity.  
	 * If there's 2 or more Entities with the same name, the lasts created will be enumerated with `_id` on their ends.  
	 * Default `Unknow`.
	 */
  name?: string;
  /** The current working directory of your process. */
  cwd?: string;
  /** Whether the Entity should automaticaly reload on `error` or `exit`. Default `false` */
  reloadable?: boolean;
  /** List of signals that when emitted will reload your application. Not string or number arguments will be ignored. Ignored if `this.readable` is `false`. */
  reloadSignals?: (string | number)[];
  /** List of signals to ignore in `reloadable` parameter. Not string or number arguments will be ignored. Ignored if `this.readable` is `false`. */
  reloadSignalsExceptions?: (string | number)[];
	/** Whether your `spawn`, `error`, `exit` and `data` events should be executed before your `callback`. Default `true`.*/
	allowDefaults?: boolean;
}
/** The command to run your process or an object with your Entity properties. */
export type EntityCommand = string | EntityCommandData;
export type EntityCallback = (error: Error | string | null, exitCode: number | null, data: string | null) => void;

export interface EntityEvent<N extends keyof EntityEvents> {
  name: N,
  callback(...args: EntityEvents[N]): void
}
export interface EntityEvents {
  spawn: [];
  error: [error: Error | string];
  exit: [code: number | null, signal: NodeJS.Signals | string | null];
  data: [data: string];
  stderr_data: [data: string];
  stdout_data: [data: string];
}

export interface EntityKillCodes {
  4000: 'UNKNOW';
  4001: 'RELOAD_ATTEMPTIES_EXCEEDED';
}
