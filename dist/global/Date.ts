import './types';

Date.prototype.format = function (this: Date, replacer: string): string {
	const formatedDate = replacer
		.replace(/mm/g, (this.getMonth() + 1).resize(2))
		.replace(/dd/g, this.getDate().resize(2))
		.replace(/yyyy/g, this.getFullYear().resize(4))
		.replace(/yy/g, `${this.getFullYear()}`.slice(2))
		.replace(/HH/g, this.getHours().resize(2))
		.replace(/MM/g, this.getMinutes().resize(2))
		.replace(/SS/g, this.getSeconds().resize(2))
		.replace(/MS/g, this.getMilliseconds().resize(3))
		.replace(/GMT/g, `GMT${this.getHours() - this.getUTCHours()}`);
	return formatedDate;
}
