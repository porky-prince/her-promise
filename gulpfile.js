'use strict';
const path = require('path');
const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const ROOT = __dirname;

function compileTask(isProd) {
	gulp.task('compile', () => {
		return rollup
			.rollup({
				input: path.join(ROOT, 'src/index.ts'),
				// input: ['src/promise.ts', 'src/finally.ts'],
				onwarn: warning => {
					if (warning.code === 'CIRCULAR_DEPENDENCY') {
						console.warn('circular dependency:\n' + warning);
					}
				},
				treeshake: false,
				plugins: [
					nodeResolve(),
					commonjs(),
					typescript({
						tsconfig: path.join(ROOT, 'tsconfig.json'),
					}),
				],
			})
			.then(bundle => {
				return bundle.write({
					file: path.join(ROOT, 'build/her-promise.js'),
					format: 'iife',
					sourcemap: 'inline',
				});
				/*return bundle.write({
					dir: 'build',
					format: 'cjs',
					sourcemap: 'inline',
				});*/
			})
			.catch(console.error);
	});
}

compileTask();

gulp.task('watch', () => {
	gulp.watch(['src/**/*.ts'], gulp.series('compile'));
});

gulp.task('build', cb => {
	// const buildDir = path.join(ROOT, 'build');
	cb();
});
