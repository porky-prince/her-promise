// Remove global Promise
if (typeof window === 'object') {
	window.Promise = undefined;
}

if (typeof global === 'object') {
	global.Promise = undefined;
}
