import callLate from 'calllate';
import { isArr, isFunc, isObjOrFunc } from './utils';

/**
 * Promise States
 * A promise must be in one of three states: pending, fulfilled, or rejected.
 */
const Pending: string = 'pending';
const Fulfilled: string = 'fulfilled';
const Rejected: string = 'rejected';

interface IResolve<T> {
	(value?: T | PromiseLike<T>): void;
}

interface IResolveValue<T> {
	(value?: T): void;
}

interface IReject {
	(reason?: any): void;
}

function onThen<T>(
	func: Function | undefined | null,
	args: any,
	p: Promise<T>,
	resolve: IResolve<T>,
	reject: IReject,
	noFunc: IResolve<T> | IReject
): void {
	if (!isFunc(func)) {
		if (noFunc === reject) {
			console.error('Uncaught (in promise) ' + args);
		}
		// If onFulfilled is not a function, it must be ignored.
		// If onRejected is not a function, it must be ignored.
		noFunc(args);
		return;
	}
	let arg;
	try {
		arg = (func as Function)(args);
	} catch (err: any) {
		reject(err);
		return;
	}
	if (arg === p) {
		reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
		return;
	}
	callThen<T>(arg, resolve, reject);
}

function tryThen<T>(
	then: Function,
	arg: T | PromiseLike<T> | undefined,
	resolve: IResolveValue<T>,
	reject: IReject
): void {
	callLate(() => {
		let once: boolean = false;
		try {
			then.call(
				arg,
				(value: T) => {
					if (once) {
						return;
					}
					once = true;
					callThen(value, resolve, reject);
				},
				(reason: any) => {
					if (once) {
						return;
					}
					once = true;
					reject(reason);
				}
			);
		} catch (err: any) {
			if (!once) {
				once = true;
				reject(err);
			}
		}
	});
}

function callThen<T>(
	arg: T | PromiseLike<T> | undefined,
	resolve: IResolveValue<T>,
	reject: IReject
): void {
	if (isObjOrFunc(arg)) {
		let then;
		try {
			// If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
			then = (arg as PromiseLike<T>).then;
		} catch (err: any) {
			reject(err);
			return;
		}
		if (isFunc(then)) {
			if (arg instanceof Promise) {
				then.call(arg, resolve, reject);
			} else {
				// “thenable” is an object or function that defines a then method.
				tryThen(then, arg, resolve, reject);
			}
			return;
		}
	}
	resolve(arg as T | undefined);
}

export class Promise<T> {
	// When pending, a promise: may transition to either the fulfilled or rejected state.
	private _state: string = Pending;
	private _value: T | undefined = undefined;
	private _reason: any = undefined;
	private _resolves: Function[] = [];
	private _rejects: Function[] = [];

	constructor(executor: (resolve: IResolve<T>, reject: IReject) => void) {
		const resolves = this._resolves;
		const resolve: IResolveValue<T> = (value?: T): void => {
			// When fulfilled, a promise: must not transition to any other state.
			if (this._state === Pending) {
				// Must have a value, which must not change.
				this._state = Fulfilled;
				this._value = value;
				const length = resolves.length;
				if (length === 0) {
					return;
				}
				for (let i = 0; i < length; ++i) {
					resolves[i]();
				}
				resolves.length = 0;
			}
		};

		const rejects = this._rejects;
		const reject: IReject = (reason?: any): void => {
			// When rejected, a promise: must not transition to any other state.
			if (this._state === Pending) {
				// must have a reason, which must not change.
				this._state = Rejected;
				this._reason = reason;
				const length = rejects.length;
				if (length === 0) {
					return;
				}
				for (let i = 0; i < length; ++i) {
					rejects[i]();
				}
				rejects.length = 0;
			}
		};

		try {
			executor((value?: T | PromiseLike<T>): void => {
				callThen<T>(value, resolve, reject);
			}, reject);
		} catch (err: any) {
			reject(err);
		}
	}

	/**
	 * A promise must provide a then method to access its current or eventual value or reason.
	 * A promise’s then method accepts two arguments: onFulfilled onRejected
	 * Both onFulfilled and onRejected are optional arguments.
	 *
	 * @param {(<T>(value: T) => (PromiseLike<TResult1> | TResult1)) | undefined | null} onFulfilled
	 * @param {((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null} onRejected
	 * @returns {Promise<TResult1 | TResult2>} then must return a promise
	 */
	then<TResult1 = T, TResult2 = never>(
		onFulfilled?: (<T>(value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
		onRejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null
	): Promise<TResult1 | TResult2> {
		const p = new Promise<TResult1 | TResult2>((resolve, reject) => {
			switch (this._state) {
				case Fulfilled:
					callLate(() => {
						onThen(onFulfilled, this._value, p, resolve, reject, resolve);
					});
					break;
				case Rejected:
					callLate(() => {
						onThen(onRejected, this._reason, p, resolve, reject, reject);
					});
					break;
				default:
					this._resolves.push(() => {
						callLate(() => {
							onThen(onFulfilled, this._value, p, resolve, reject, resolve);
						});
					});

					this._rejects.push(() => {
						callLate(() => {
							onThen(onRejected, this._reason, p, resolve, reject, reject);
						});
					});
					break;
			}
		});

		return p;
	}

	catch<TResult = never>(
		onRejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null
	): Promise<T | TResult> {
		return this.then(void 0, onRejected);
	}

	/**
	 * Creates a Promise that is resolved with an array of results when all of the provided Promises
	 * resolve, or rejected when any Promise is rejected.
	 * @param values An array of Promises.
	 * @returns A new Promise.
	 */
	static all<T extends readonly unknown[] | []>(
		values: T
	): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
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
			let isReject: boolean = false;
			for (let i = 0; !isReject && i < length; ++i) {
				callThen(
					values[i],
					value => {
						if (isReject) return;
						results[i] = value;
						if (++count === length) {
							resolve(results as any);
						}
					},
					reason => {
						if (isReject) return;
						isReject = true;
						reject(reason);
					}
				);
			}
		});
	}

	/**
	 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	 * or rejected.
	 * @param values An array of Promises.
	 * @returns A new Promise.
	 */
	static race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>> {
		return new Promise((resolve, reject) => {
			if (!isArr(values)) {
				return reject(new TypeError('The arguments must be Array.'));
			}
			const length: number = values.length;
			for (let i = 0; i < length; ++i) {
				callThen(values[i], resolve, reject);
			}
		});
	}

	/**
	 * Creates a new rejected promise for the provided reason.
	 * @param reason The reason the promise was rejected.
	 * @returns A new rejected Promise.
	 */
	static reject<T = never>(reason?: any): Promise<T> {
		return new Promise<T>((resolve, reject) => reject(reason));
	}

	/**
	 * Creates a new resolved promise.
	 * @returns A resolved promise.
	 */
	static resolve(): Promise<void>;

	/**
	 * Creates a new resolved promise for the provided value.
	 * @param value A promise.
	 * @returns A promise whose internal state matches the provided promise.
	 */
	static resolve<T>(value?: T | PromiseLike<T>): Promise<T> {
		if (value instanceof Promise) return value;
		return new Promise<T>(resolve => resolve(value));
	}
}
