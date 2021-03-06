const globalObj = typeof window === 'object' ? window : typeof global === 'object' ? global : self;
if (typeof globalObj.Promise !== 'function') {
	globalObj.Promise = require('./promise').Promise;
}

require('./finally');
require('./allSettled');
globalObj.AggregateError = require('./any').$AggregateError;
