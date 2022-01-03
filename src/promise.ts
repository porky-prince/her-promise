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
	reject: IReject,
	noFunc: IResolve<T> | IReject
): void {
	if (!isFunc(func)) {
		// If onFulfilled is not a function, it must be ignored.
		// If onRejected is not a function, it must be ignored.
		noFunc(args);
		return;
	}
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
	callThen<T>(arg, resolve, reject);
}

function tryThen<T>(
	then: Function,
	arg: T | PromiseLike<T>,
	resolve: IResolve<T>,
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

function callThen<T>(arg: T | PromiseLike<T>, resolve: IResolve<T>, reject: IReject): void {
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
				tryThen(then, arg, resolve, reject);
			}
			return;
		}
	}
	resolve(arg);
}

export class Promise<T> {
	// When pending, a promise: may transition to either the fulfilled or rejected state.
	private _state: string = Pending;
	private _value: T = undefined;
	private _reason: any = undefined;
	private _resolves: Function[] = [];
	private _rejects: Function[] = [];

	constructor(executor: (resolve: IResolve<T>, reject: IReject) => void) {
		const resolves = this._resolves;
		const resolve: IResolve<T> = (value?: T): void => {
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
					// console.warn('Uncaught (in promise) ' + reason);
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
		return new Promise<T | TResult>((resolve, reject) => {});
	}
}
