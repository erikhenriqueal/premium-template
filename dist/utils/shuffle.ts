import "../global";
import random from "./random";

/**
 * This function get your array from `list` parameter and creates a new, but all items are in randomized positions/indexes.
 * @example
 * const list = [ "Apple", "Grape", "Pear", "Watermelon" ];
 * const newList = shuffle(list);
 * console.log(list); // ["Apple", "Grape", "Pear", "Watermelon"]
 * console.log(newList); // ["Grape", "Watermelon", "Pear", "Apple"]
 */
export default function shuffle(list: any[]) {
	const shuffledList: typeof list = [];
	for (let indexes: number[] = [], i = 0; i < list.length; i++) {
		const index = generateIndex();
		shuffledList[index] = list[i];
		indexes.push(index);
		function generateIndex(): number {
			const index = random(0, list.length - 1) as number;
			if (indexes.includes(index)) return generateIndex();
			return index;
		}
	}
	return shuffledList;
}
