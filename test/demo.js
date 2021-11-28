function delay() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(1);
			resolve(111);
		}, 100);
	});
}

/*delay().then((value) => {
	console.log(value);
});*/
let p = delay();

setTimeout(() => {
	p.then(value => {
		console.log(3);
		console.log(value);
	});
	console.log(4);
}, 2000);
