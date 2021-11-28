import callLate from 'calllate';

describe('test', () => {
	test('1 + 1 to equal 2', done => {
		callLate(() => {
			expect(1 + 1).toBe(2);
			done();
		});
	});
});
