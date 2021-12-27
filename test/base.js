require('./register');
require('../build/her-promise');

Promise.defer = Promise.deferred = function () {
	var dfd = {};
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	});
	return dfd;
};
module.exports = Promise;
