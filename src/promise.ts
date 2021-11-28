import callLate from 'calllate';

callLate(() => {
	console.log(1);
});

enum EStates {
	Pending,
	Fulfilled,
	Rejected,
}

interface IResolve<T> {
	(value?: T | PromiseLike<T>): void;
}

interface IReject {
	(reason?: any): void;
}

class $Promise<T> implements Promise<T> {
	private _state: EStates = EStates.Pending;
	// private _value: T | PromiseLike<T> = undefined;
	// private _reason: any = undefined;
	private _observers: Function[] = [];

	constructor(executor: (resolve: IResolve<T>, reject: IReject) => void) {
		try {
			executor(this.resolve.bind(this), this.reject.bind(this));
		} catch (err: any) {
			this.reject(err);
		}
	}

	private resolve(value?: T | PromiseLike<T>): void {
		if (this._state === EStates.Pending) {
			this._state = EStates.Fulfilled;
		}
	}

	private reject(reason?: any): void {
		if (this._state === EStates.Rejected) {
			this._state = EStates.Rejected;
		}
	}

	then<TResult1 = T, TResult2 = never>(
		onFulfilled?: (<T>(value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
		onRejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | undefined | null
	): $Promise<TResult1 | TResult2> {
		if (this._state === EStates.Fulfilled) {
			//calllate
		} else if (this._state === EStates.Pending) {
		}
		// save
		return this;
	}

	catch<TResult = never>(
		onRejected?: ((reason: any) => PromiseLike<TResult> | TResult) | undefined | null
	): $Promise<T | TResult> {
		// save
		return this;
	}
}
