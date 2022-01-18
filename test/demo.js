/**
 * 需要注意的地方：
 * 1.then方法中callLate调用的位置不对，导致p为undefined；
 * 2.不传catch方法则then返回的Promise则会reject，且理由与前一次一致；
 * 3.resolve传进来的value可能是Promise，需要在构造函数中处理而不是then后；
 * 4.resolve传进来的value和then返回的参数可能是PromiseLike或其他值，这里判断处理，
 * PromiseLike的then方法可能是异步也可能是同步的，或者异常，需要注意PromiseLike的嵌套返回和异常处理；
 */
function delay() {
	return new Promise((resolve, reject) => {
		// resolve(111);
		/*resolve({
			then: function (a) {
				a(222);
				throw new Error('haha');
			},
		});*/
		/*resolve(
			new Promise((resolve1, reject1) => {
				setTimeout(() => {
					resolve1(111);
				}, 100);
			})
		);*/
		setTimeout(() => {
			console.log(333);
			reject(111);
			/*isDone = true;
			resolve(
				new Promise((resolve1, reject1) => {
					setTimeout(() => {
						reject1(111);
					}, 1000);
				})
			);*/
		}, 100);
	});
}

/*delay().then((value) => {
	console.log(value);
});*/
/*let p = delay().then(value => {
	console.log(value);
});

setTimeout(() => {
	/!*p.catch(reason => {
		console.log(reason);
	});*!/
	/!*p.then(value => {
		console.log(3);
		console.log(typeof value);
		return 222;
	}).then(value => {
		console.log(5);
		console.log(value);
	});*!/
	console.log(p);
}, 1000);*/

/*Promise.all([1, 'aa', true, delay(), undefined, null, delay(), delay()]).then(result => {
	console.log(result);
});*/

/*Promise.race([Promise.resolve(111), Promise.reject(222)])
	.then(result => {
		console.log(result);
	})
	.finally();*/
