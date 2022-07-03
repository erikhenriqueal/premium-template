// log.ts

/** A `string` to log or an `object`. */
export type LogData = string | {
	/** A `string` to log. */
	message: string;
	/**
	 * You can use one of **Paths Presets** bellow to refer to a path.
	 * - **$cwd**: like as `process.cwd()` function.
	 * - **$client**: `$cwd/dist/client`.
	 * - **$logs**: `$cwd/logs` (default logs path).
	*/
	paths?: string[];
	/** A custom `timestamp` to set to your log. */
	timestamp?: string | number | Date;
}
