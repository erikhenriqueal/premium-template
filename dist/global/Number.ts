import './types';

Number.prototype.resize = function (this: number, length: number, reverse: boolean = false): string {
	length -= `${parseInt(`${this}`)}`.length;
	if (length <= 0) return this.toString();
	return reverse ? `${this.toString()}${'0'.repeat(length)}` : `${'0'.repeat(length)}${this.toString()}`;
}
