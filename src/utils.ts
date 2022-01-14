export function isObjOrFunc(arg: any): boolean {
	const type: string = typeof arg;
	return arg !== null && (type === 'object' || type === 'function');
}

export function isFunc(arg: any): arg is Function {
	return typeof arg === 'function';
}

let isArray: (arg: any) => arg is any[];
if (isFunc(Array.isArray)) {
	isArray = Array.isArray;
} else {
	isArray = function (arg: any): arg is any[] {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
export const isArr = isArray;

export function defineProp<T extends Object>(obj: T, prop: keyof T, value: Function): void {
	if (!isFunc(obj[prop])) {
		Object.defineProperty(obj, prop, {
			configurable: true,
			enumerable: false,
			value,
			writable: true,
		});
	}
}
