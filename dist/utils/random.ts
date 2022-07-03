/**
 * Calculates a random number between `min` and `max` by `seed` random generation from `0` to `1` (like as `Math.random()`).
 * @param seed A random number between `0` and `1`.
 * @param minimal
 * @param maximum
 * @param decimal
 */
export function calc(seed: number, minimal: number, maximum: number, decimal: boolean = false) {
	const num = (seed * (maximum - minimal)) + minimal;
	if (decimal) return num;
	return Math.floor(num);
}

/**
 * This function returns a random number between {from} and {to}.
 * @param { number } min Minimum number to randomize {from} (it's `zero` by default).
 * @param { number } max Maximum number to randomize {to} (it's `one` by default).
 * @param { boolean } decimal Whether the number must be integer or decimal (default: false).
 * @param { boolean } details Instead of return just a number, the random function will now return all informations it have about your number.
 * @example
 * random(0, 3); // Return 0, 1, 2 or 3
 * random(0, 1, true); // Return a decimal between 0 and 1
 */
export default function random(min: number, max: number, decimal: boolean = false, details: boolean = false) {
	const a = min <= max ? min : max; // Min
	const z = max >= min ? max : min; // Max
	const y = Math.random();
	const x = calc(y, a, z, decimal);

	if (details) return { value: x, random: y, min: a, max: z, method: calc };
	return x;
}
