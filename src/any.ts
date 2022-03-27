import { defineProp, isArr } from './utils';

export let $AggregateError: AggregateErrorConstructor;
if (typeof AggregateError === 'function') {
	$AggregateError = AggregateError;
} else {
	$AggregateError = class extends Error {
		constructor(public errors: any[], message = 'All promises were rejected.') {
			super(message);
		}
	};
}

defineProp(
	Promise,
	'any',
	<T>(values: Iterable<T | PromiseLike<T>>): Promise<T> =>
		new Promise((resolve, reject) => {
			if (!isArr(values)) {
				reject(new TypeError('The arguments must be Array.'));
				return;
			}

			const { length } = values;
			const reasons = new Array(0);
			if (length === 0) {
				reject(new $AggregateError(reasons));
				return;
			}

			let count = 0;
			function onReject(reason: any): void {
				reasons.push(reason);
				if (++count === length) {
					reject(new $AggregateError(reasons));
				}
			}

			for (let i = 0; i < length; ++i) {
				let p: Promise<T>;
				if (values[i] instanceof Promise) {
					p = values[i];
				} else {
					p = Promise.resolve(values[i]);
				}

				p.then(resolve, onReject);
			}
		})
);
