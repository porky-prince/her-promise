'use strict';
const path = require('path');
const BuildDir = path.join(__dirname, 'build');

module.exports = {
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
