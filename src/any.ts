import { defineProp, isArr } from './utils';

let $AggregateErr: AggregateErrorConstructor;
if (typeof AggregateError === 'function') {
	$AggregateErr = AggregateError;
} else {
	$AggregateErr = class extends Error {
		constructor(public errors: any[], message: string = 'All promises were rejected.') {
			super(message);
		}
	};
}

export const AggregateErr = $AggregateErr;

defineProp(Promise, 'any', function <T extends readonly unknown[] | []>(values: T): Promise<
	Awaited<T[number]>
> {
	return new Promise((resolve, reject) => {
		if (!isArr(values)) {
			return reject(new TypeError('The arguments must be Array.'));
		}
		const length: number = values.length;
		const reasons = new Array(0);
		if (length === 0) {
			return reject(new $AggregateErr(reasons));
		}

		let count: number = 0;
		for (let i = 0; i < length; ++i) {
			let p: Promise<unknown>;
			if ((values[i] as unknown) instanceof Promise) {
				p = values[i];
			} else {
				p = Promise.resolve(values[i]);
			}
			p.then(resolve as any, reason => {
				reasons.push(reason);
				if (++count === length) {
					reject(new $AggregateErr(reasons));
				}
			});
		}
	});
});
