import { defineProp, isFunc } from './utils';

defineProp(Promise.prototype, 'finally', function <
	T
>(this: Promise<T>, onfinally?: (() => void) | undefined | null): Promise<T> {
	return this.then(
		value => Promise.resolve(isFunc(onfinally) ? onfinally() : onfinally).then(() => value),
		reason =>
			Promise.resolve(isFunc(onfinally) ? onfinally() : onfinally).then(() => {
				throw reason;
			})
	);
});
