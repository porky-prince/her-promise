const globalObj = typeof window === 'object' ? window : typeof global === 'object' ? global : self;
if (typeof globalObj.Promise === 'function') {
	const { Promise } = require('./promise');
	console.log(Promise);
} else {
	console.log('1111');
}
