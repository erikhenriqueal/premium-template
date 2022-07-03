import './types';
import { JSONCleanOptions } from './types';

JSON.clean = function (this: JSON, value: any, options: JSONCleanOptions | boolean) {
	if ([undefined, null].includes(value) || typeof value !== 'object') return value;
	value = JSON.parse(JSON.stringify(value));
	if (typeof options === 'boolean' || options.all) {
		if (options === true || (options as JSONCleanOptions).all) options = { nulls: true, zeros: true, emptyArrays: true, emptyObjects: true, emptyStrings: true };
		else options = {};
	}
	let result: typeof value = {} || [];
	for (const key of Object.keys(value)) {
		const target = value[key];
		if (options.nulls && [null, undefined].includes(target)) continue;
		if (options.zeros && target === 0) continue;
		if (options.emptyArrays && (Array.isArray(target) && target.length === 0)) continue;
		if (options.emptyObjects && (typeof target === 'object' && Object.keys(target).length === 0)) continue;
		if (options.emptyStrings && (typeof target === 'string' && target.length === 0)) continue;
		if (typeof target === 'object') result[key] = JSON.clean(target, options);
		else result[key] = target;
	}
	return result as any;
}

JSON.cleanStringify = function (this: JSON, value: any, options?: JSONCleanOptions | boolean, replacer?: any, space?: number | string) {
	if (!options) return JSON.stringify(value, replacer, space);
	if (typeof options === 'boolean' || options.all) {
		if (options === true || (options as JSONCleanOptions).all) options = { nulls: true, zeros: true, emptyArrays: true, emptyObjects: true, emptyStrings: true };
		else options = {};
	}
	if (Array.isArray(replacer)) replacer = replacer.filter(i => typeof i === 'function');
	return JSON.stringify(JSON.clean(value, options), replacer, space);
}
