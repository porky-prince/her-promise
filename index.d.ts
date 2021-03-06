interface Promise<T> {
	/**
	 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
	 * resolved value cannot be modified from the callback.
	 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
	 * @returns A Promise for the completion of the callback.
	 */
	finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

interface AggregateError extends Error {
	errors: any[];
}

interface AggregateErrorConstructor {
	new (errors: any[], message?: string): AggregateError;

	readonly prototype: AggregateError;
}

declare var AggregateError: AggregateErrorConstructor;

interface PromiseFulfilledResult<T> {
	status: 'fulfilled';
	value: T;
}

interface PromiseRejectedResult {
	status: 'rejected';
	reason: any;
}

// @ts-ignore
type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

interface PromiseConstructor {
	/**
	 * Creates a Promise that is resolved with an array of results when all
	 * of the provided Promises resolve or reject.
	 * @param values An array of Promises.
	 * @returns A new Promise.
	 */
	allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<T>[]>;

	/**
	 * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
	 * @param values An array or iterable of Promises.
	 * @returns A new Promise.
	 */
	any<T extends readonly unknown[] | []>(values: T): Promise<T[number]>;

	/**
	 * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
	 * @param values An array or iterable of Promises.
	 * @returns A new Promise.
	 */
	any<T>(values: Iterable<T | PromiseLike<T>>): Promise<T>;

	/**
	 * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
	 * @param values An array or iterable of Promises.
	 * @returns A new Promise.
	 */
	any<T>(values: (T | PromiseLike<T>)[] | Iterable<T | PromiseLike<T>>): Promise<T>;
}
