import './register';
import { Promise } from '../src/promise';

function delay<T>(time: number = 0, args?: T, isReject: boolean = false): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			isReject ? reject(args) : resolve(args);
		}, time);
	});
}

function late<T>(args?: T, isReject: boolean = false): Promise<T> {
	return new Promise((resolve, reject) => {
		isReject ? reject(args) : resolve(args);
	});
}

function notExec(): void {
	throw new Error('will not be exec');
}

describe('Promise test', () => {
	test('global promise is undefined', () => {
		if (typeof window === 'object') {
			expect(window.Promise).toBe(undefined);
		}
		if (typeof global === 'object') {
			expect(global.Promise).toBe(undefined);
		}
	});

	test('resolve test', done => {
		delay(100, 1).then(value => {
			expect(value).toBe(1);
			late([1]).then(value => {
				expect(value[0]).toBe(1);
				done();
			});
		});
	});

	test('reject test', done => {
		delay(100, 'test', true).then(notExec, reason => {
			expect(reason).toBe('test');
			late(false, true).then(notExec, reason => {
				expect(reason).toBe(false);
				done();
			});
		});
	});
});
