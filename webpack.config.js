'use strict';
const path = require('path');
const BuildDir = path.join(__dirname, 'build');

const config = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		app: './src/index.ts',
	},
	output: {
		path: BuildDir,
		filename: 'her-promise.js',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};

module.exports = function () {
	if (process.argv[3]) {
		delete config.mode;
		delete config.devtool;
		config.output.filename = config.output.filename.replace('.js', '.min.js');
	}
	return config;
};
