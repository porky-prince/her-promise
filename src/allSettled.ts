import { defineProp, isArr } from './utils';

defineProp(
	Promise,
	'allSettled',
	<T>(values: Iterable<T | PromiseLike<T>>): Promise<Array<PromiseSettledResult<T>>> =>
		new Promise((resolve, reject) => {
			if (!isArr(values)) {
				reject(new TypeError('The arguments must be Array.'));
				return;
			}

			const { length } = values;
			const results: Array<PromiseSettledResult<T>> = new Array(length);
			if (length === 0) {
				resolve(results);
				return;
			}

			let count = 0;

			function allDone(): void {
				if (++count === length) {
					resolve(results);
				}
			}

			for (let i = 0; i < length; ++i) {
				let p: Promise<T>;
				if (values[i] instanceof Promise) {
					p = values[i];
				} else {
					p = Promise.resolve(values[i]);
				}

				p.then(
					value => {
						results[i] = {
							status: 'fulfilled',
							value
						};
						allDone();
					},
					reason => {
						results[i] = {
							status: 'rejected',
							reason
						};
						allDone();
					}
				);
			}
		})
);
