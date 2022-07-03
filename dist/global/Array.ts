import './types';

import shuffle from '../utils/shuffle';

Array.prototype.uniques = function (this: []): typeof this {
	const uniques: typeof this = [];
	for (const item of this) {
		if (uniques.includes(item)) continue;
		uniques.push(item);
	}
	return uniques;
}

Array.prototype.shuffle = function (this: any[]): typeof this {
	return shuffle(this);
}
