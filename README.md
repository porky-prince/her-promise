[![npm][npm]][npm-url]
[![node][node]][node-url]
[![size][size]][size-url]

# her-promise

> This is a polyfill of the ES6/ES9/ES11/ES12 Promise.

## Install

npm:

```sh
$ npm install --save her-promise
```

yarn:

```sh
$ yarn add her-promise
```

### Browser

```html
<script src="her-promise.js"></script>
```

## Usage

### Using in code

#### Using in browser

```html
<script>
	new Promise((resolve, reject) => {
		reject();
	}).finally(() => {
		// ...
	});

	Promise.race([
		// ...
	]).then(() => {
		// ...
	});

	Promise.allSettled([
		// ...
	]).then(() => {
		// ...
	});

	Promise.any([
		// ...
	]).then(() => {
		// ...
	});
</script>
```

#### Using in es6 or typescript

```js
// You can import in entry file at first
import 'her-promise';

new Promise((resolve, reject) => {
	reject();
}).finally(() => {
	// ...
});

Promise.race([
	// ...
]).then(() => {
	// ...
});

Promise.allSettled([
	// ...
]).then(() => {
	// ...
});

Promise.any([
	// ...
]).then(() => {
	// ...
});
```

## License

[MIT © Porky Ke](./LICENSE)

[npm]: https://img.shields.io/npm/v/her-promise.svg
[npm-url]: https://npmjs.com/package/her-promise
[node]: https://img.shields.io/node/v/her-promise.svg
[node-url]: https://nodejs.org
[size]: https://packagephobia.now.sh/badge?p=her-promise
[size-url]: https://packagephobia.now.sh/result?p=her-promise
