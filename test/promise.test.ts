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

describe('Promise base test', () => {
	test('then resolve', done => {
		delay(100, 1).then(value => {
			expect(value).toBe(1);
			late([1]).then(value => {
				expect(value[0]).toBe(1);
				done();
			});
		});
	});

	test('then reject', done => {
		delay(100, 'test', true).then(notExec, reason => {
			expect(reason).toBe('test');
			late(false, true).then(notExec, reason => {
				expect(reason).toBe(false);
				done();
			});
		});
	});

	test('catch', done => {
		delay(100, 'test', true)
			.then(notExec)
			.catch(reason => {
				expect(reason).toBe('test');
				done();
			});
	});

	test('finally after then', done => {
		delay(100, 1)
			.then(value => delay(10, ++value))
			.catch(notExec)
			.finally(() => {
				expect(1).toBe(1);
			})
			.then(value => {
				expect(value).toBe(2);
				done();
			})
			.catch(notExec);
	});

	test('catch after finally', done => {
		delay(100, 'test', true)
			.then(notExec)
			.finally(() => {
				expect(1).toBe(1);
			})
			.then(notExec)
			.catch(reason => {
				expect(reason).toBe('test');
				done();
			});
	});
});

describe('Promise static method test', () => {
	test('Promise.resolve base value', done => {
		Promise.resolve(1).then(value => {
			expect(value).toBe(1);
			done();
		});
	});

	test('Promise.resolve promise value', done => {
		Promise.resolve(delay(50, 1)).then(value => {
			expect(value).toBe(1);
			done();
		});
	});

	test('Promise.reject', done => {
		Promise.reject('test').then(notExec, reason => {
			expect(reason).toBe('test');
			done();
		});
	});

	test('Promise.all all done', done => {
		Promise.all([1, 'test', true, delay(50, 2), undefined, null, delay(10, 3)]).then(values => {
			expect(values).toEqual([1, 'test', true, 2, undefined, null, 3]);
			done();
		});
	});

	test('Promise.all reject at first', done => {
		Promise.all([1, 'test', true, delay(50, 2, true), undefined, null, delay(10, 3)]).then(
			notExec,
			reason => {
				expect(reason).toBe(2);
				done();
			}
		);
	});

	test('Promise.all reject at last', done => {
		Promise.all([1, 'test', true, delay(50, 2), undefined, delay(10, 3, true), null]).then(
			notExec,
			reason => {
				expect(reason).toBe(3);
				done();
			}
		);
	});

	test('Promise.all all reject', done => {
		Promise.all([
			1,
			'test',
			true,
			delay(50, 2, true),
			undefined,
			delay(10, 3, true),
			null
		]).then(notExec, reason => {
			expect(reason).toBe(3);
			done();
		});
	});

	test('Promise.race resolve', done => {
		Promise.race([1, 'test', true, delay(50, 2, true), undefined, null, delay(10, 3)]).then(
			value => {
				expect(value).toBe(1);
				done();
			}
		);
	});

	test('Promise.race reject', done => {
		Promise.race([delay(50, 2), delay(10, 3, true)]).then(notExec, reason => {
			expect(reason).toBe(3);
			done();
		});
	});

	test('Promise.allSettled all done', done => {
		Promise.allSettled([1, 'test', true, delay(50, 2), undefined, null, delay(10, 3)]).then(
			values => {
				expect(values).toEqual(
					[1, 'test', true, 2, undefined, null, 3].map(value => {
						return {
							status: 'fulfilled',
							value
						};
					})
				);
				done();
			}
		);
	});

	test('Promise.allSettled some rejected', done => {
		Promise.allSettled([1, delay(50, 'test', true), 3]).then(values => {
			expect(values).toEqual([
				{
					status: 'fulfilled',
					value: 1
				},
				{
					status: 'rejected',
					reason: 'test'
				},
				{
					status: 'fulfilled',
					value: 3
				}
			]);
			done();
		}, notExec);
	});

	test('Promise.allSettled all rejected', done => {
		Promise.allSettled([delay(50, 1, true), delay(10, 2, true)]).then(values => {
			expect(values).toEqual([
				{
					status: 'rejected',
					reason: 1
				},
				{
					status: 'rejected',
					reason: 2
				}
			]);
			done();
		}, notExec);
	});

	test('Promise.any export AggregateError', () => {
		expect(typeof AggregateError).toBe('function');
	});

	test('Promise.any any resolve', done => {
		Promise.any([delay(50, 1, true), 2, delay(10, 3, true)]).then(value => {
			expect(value).toBe(2);
			done();
		}, notExec);
	});

	test('Promise.any all rejected', done => {
		Promise.any([delay(50, 1, true), delay(10, 2, true)]).then(notExec, reason => {
			expect(reason.errors).toEqual([2, 1]);
			done();
		});
	});
});
