import { defineProp, isArr } from './utils';

defineProp(Promise, 'allSettled', function <T extends readonly unknown[] | []>(values: T): Promise<{
	-readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
}> {
	return new Promise((resolve, reject) => {
		if (!isArr(values)) {
			return reject(new TypeError('The arguments must be Array.'));
		}
		const length: number = values.length;
		const results = new Array(length);
		if (length === 0) {
			return resolve(results as any);
		}
		let count: number = 0;
		function allDone(): void {
			if (++count === length) {
				resolve(results as any);
			}
		}
		for (let i = 0; i < length; ++i) {
			let p: Promise<unknown>;
			if ((values[i] as unknown) instanceof Promise) {
				p = values[i];
			} else {
				p = Promise.resolve(values[i]);
			}
			p.then(value => {
				results[i] = {
					status: 'fulfilled',
					value,
				};
				allDone();
			}).catch(reason => {
				results[i] = {
					status: 'rejected',
					reason,
				};
				allDone();
			});
		}
	});
});
