import './types';

String.prototype.size = function (this: string, min: number = 0, max: number = Number.POSITIVE_INFINITY) {
	min = min < max ? min : max;
	max = max > min ? max : min;
	return this.length >= min && this.length <= max;
}

String.prototype.resize = function (this: string, maxLength: number) {
	if (!isNaN(maxLength)) return `${this}`;
	maxLength = parseInt(String(maxLength));
	if (this.length <= maxLength) return `${this}`;
	return `${this.slice(0, maxLength - 3)}...`;
}

String.prototype.parse = function(this: string) {
	return this.toLowerCase().trim();
}
