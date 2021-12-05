// Remove global Promise
if (typeof window === 'object') {
	window.Promise = undefined;
}
if (typeof global === 'object') {
	global.Promise = undefined;
}

import callLate from 'calllate';

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

interface IReject {
	(reason?: any): void;
}

function isObjOrFunc<T>(arg: T): boolean {
	const type: string = typeof arg;
	return arg !== null && (type === 'object' || type === 'function');
}

function isFunc<T>(arg: T): boolean {
	return typeof arg === 'function';
}

function onThen<T>(
	func: Function,
	args: any,
	p: Promise<T>,
	resolve: IResolve<T>,
	reject: IReject
): void {
	callLate(() => {
		let arg;
		try {
			arg = func(args);
		} catch (err: any) {
			reject(err);
			return;
		}
		if (arg === p) {
			reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
			return;
		}
		if (isObjOrFunc(arg)) {
			let then;
			try {
				then = arg.then;
			} catch (err: any) {
				reject(err);
				return;
			}
			if (isFunc(then)) {
				then.call(arg, resolve, reject);
				return;
			}
		}
		resolve(arg);
	});
}

function onPromiseValue<T, U>(
	value: T | PromiseLike<T>,
	onFulfilled: Function,
	onRejected: Function,
	p: Promise<U>,
	resolve: IResolve<T | U>,
	reject: IReject
): void {
	if (isObjOrFunc(value)) {
		let then;
		try {
			then = (value as PromiseLike<T>).then;
		} catch (err: any) {
			if (isFunc(onRejected)) {
				onThen(onRejected, err, p, resolve, reject);
			} else {
				// If onRejected is not a function, it must be ignored.
				reject(err);
			}
			return;
		}
		if (isFunc(then)) {
			then.call(
				value,
				value => {
					if (isFunc(onFulfilled)) {
						onThen(onFulfilled, value, p, resolve, reject);
					} else {
						resolve(value);
					}
				},
				reason => {
					if (isFunc(onRejected)) {
						onThen(onRejected, reason, p, resolve, reject);
					} else {
						reject(reason);
					}
				}
			);
			return;
		}
	}
	if (isFunc(onFulfilled)) {
		onThen(onFulfilled, value, p, resolve, reject);
	} else {
		// If onFulfilled is not a function, it must be ignored.
		resolve(value);
	}
}

export default class Promise<T> {
	// When pending, a promise: may transition to either the fulfilled or rejected state.
	private _state: string = Pending;
	private _value: T | PromiseLike<T> = undefined;
	private _reason: any = undefined;
	private _resolves: Function[] = [];
	private _rejects: Function[] = [];

	constructor(executor: (resolve: IResolve<T>, reject: IReject) => void) {
		const resolves = this._resolves;
		const resolve: IResolve<T> = (value?: T | PromiseLike<T>): void => {
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
					console.warn('Uncaught (in promise) ' + reason);
					return;
				}
				for (let i = 0; i < length; ++i) {
					rejects[i]();
				}
				rejects.length = 0;
			}
		};

		try {
			executor(resolve, reject);
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
					onPromiseValue<T, TResult1 | TResult2>(
						this._value,
						onFulfilled,
						onRejected,
						p,
						resolve,
						reject
					);
					break;
				case Rejected:
					onThen(onRejected, this._reason, p, resolve, reject);
					break;
				default:
					this._resolves.push(() => {
						onPromiseValue<T, TResult1 | TResult2>(
							this._value,
							onFulfilled,
							onRejected,
							p,
							resolve,
							reject
						);
					});

					this._rejects.push(() => {
						onThen(onRejected, this._reason, p, resolve, reject);
					});
					break;
			}
		});

		return p;
	}

	catch<TResult = never>(
		onRejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null
	): Promise<T | TResult> {
		return new Promise<T | TResult>((resolve, reject) => {});
	}
}
