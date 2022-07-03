export interface JSONCleanOptions {
	all?: boolean;
	nulls?: boolean;
	zeros?: boolean;
	emptyArrays?: boolean;
	emptyStrings?: boolean;
	emptyObjects?: boolean;
}

declare global {
	interface Array<T> {
		/** Removes identical items from the array. */
		uniques(): T[];

		/** Randomize the indexes of the items in your array. */
		shuffle(): T[];
	}
	
	interface Console {
		say(message?: string): void;
	}

	interface Date {
		/**
		 * Generates a `string` replacing ingormation inside `replacer`.
		 * ___
		 * **Replacer Variables (case-sensitive):**
		 * - `mm`: returns `date.getMonth()`;
		 * - `dd`: returns `date.getDate()`;
		 * - `yyyy`: returns `date.getFullYear()`;
		 * - `yy`: returns `yy` but just the last 2;
		 * - `HH` or `h`: returns `date.getHours()`;
		 * - `MM` or `m`: returns `date.getMinutes()`;
		 * - `SS` or `s`: returns `date.getSeconds()`;
		 * - `MS` or `ms`: returns `date.getMilliseconds()`;
		 * - `GMT` or `gmt`: replaces with the actual GMT.
		 * @param replacer A `Date Replacer-Like` to replace the date.
		 * You must use one of the `Replacer Variables`. Another ones will be ignored and not replaced.
		 * @example
		 * format("mm/dd/yyyy") -> "12/31/2022";
		 * format("mm/dd/yy") -> "12/31/22";
		 * format("mm/dd, HH:MM") -> "12/31, 12:00";
		 * format("mm/dd/yyy - HH:MM:SS.MS") -> "12/31/2022, 12:00:00.000";
		 */
		format(replacer: string): string;
	}

	interface JSON {
		/**
		 * Cleans your `value` object, removing some keys as selected in `options` parameter.
		 * @param { * } value A JavaScript value, usually an object or array, to be converted.
		 * @param options All types you can remove from `value`.
		*/
		clean(value: any, options?: JSONCleanOptions | boolean): any;

		/**
		 * Similar to `JSON.stringify`, but instead of just parse the `value`, this also cleans it,
		 * removing some keys as selected in `options` parameter.
		 * @param { * } value A JavaScript value, usually an object or array, to be converted.
		 * @param options All types you can remove from `value`.
		 * @param { function | function[] } replacer A function that transforms the results.
		 * @param { string | number } space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
		*/
		cleanStringify(value: any, options?: JSONCleanOptions | boolean, replacer?: any, space?: number | string): string;
	}

	interface Number {
		/**
		 * Resizes your number inserting zeros on its start.
		 * @param { number } length The maximum length of your number. If its smaller than your number, your number is returned.
		 * @param { boolean } reverse Wheter the position of the zeros  must be reversed. The default is `false`, where the zeros are put in the start of your number. If true, they will be in the last of that.
		 */
		resize(length: number, reverse?: boolean): string;
	}

	interface String {
		/**
		 * Verifies if your `String` have a length between `min` and `max` parameters.
		 * - If `min` isn't a `Number`, it'll check just if `String` is smaller than `max` value;
		 * - If `max` isn't a `Number`, it'll check just if `String` is bigger than `min` value;
		 * - If there's no `min` and `max`, it'll return `true`;
		 * @param { number } min A minimal value length of this string (it's `zero` by default).
		 * @param { number } max The maximum value length of this string (it's `infinity` by default).
		*/
		size(min?: number, max?: number): boolean;

		/**
		 * Resizes your `String` appending ellipsis if it's necessary.
		 * @param { number } maxLength The maximum length of your String.
		*/
		resize(maxLength: number): string;

		/** Turns it into a Lower Case string and removes the spaces in the final and start of this. */
		parse(): string;
	}
}
