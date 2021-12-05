function delay() {
	return new Promise((resolve, reject) => {
		// resolve(111);
		/*resolve({
			then: function () {
				throw new Error('haha');
			},
		});*/
		resolve(
			new Promise((resolve1, reject1) => {
				setTimeout(() => {
					resolve1(111);
				}, 100);
			})
		);
		/*setTimeout(() => {
			console.log(1);
			resolve(
				new Promise((resolve1, reject1) => {
					setTimeout(() => {
						reject1(111);
					}, 1000);
				})
			);
		}, 100);*/
	});
}

/*delay().then((value) => {
	console.log(value);
});*/
let p = delay().then();

setTimeout(() => {
	/*p.catch(reason => {
		console.log(reason);
	});*/
	/*p.then(value => {
		console.log(3);
		console.log(typeof value);
		return 222;
	}).then(value => {
		console.log(5);
		console.log(value);
	});*/
	console.log(p);
}, 1000);
