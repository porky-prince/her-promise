import './register';
import '../build/her-promise';

function delay(time: number = 0, args?: any, isReject: boolean = false): Promise<any> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			isReject ? reject(args) : resolve(args);
		}, time);
	});
}

function late(args?: any, isReject: boolean = false): Promise<any> {
	return new Promise((resolve, reject) => {
		isReject ? reject(args) : resolve(args);
	});
}

function notExec(): void {
	throw new Error('will not be exec');
}

describe('Promise test', () => {
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
