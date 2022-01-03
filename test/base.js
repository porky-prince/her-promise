require('./register');
require('../build/her-promise');

Promise.deferred = function () {
	let dfd = {};
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	});
	return dfd;
};
module.exports = Promise;
