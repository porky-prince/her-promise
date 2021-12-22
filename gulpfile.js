'use strict';
const path = require('path');
const gulp = require('gulp');
const ROOT = __dirname;

gulp.task('watch', () => {
	gulp.watch(['src/**/*.ts'], gulp.series('compile'));
});

gulp.task('build', cb => {
	// const buildDir = path.join(ROOT, 'build');
	cb();
});
