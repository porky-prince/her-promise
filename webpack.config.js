'use strict';
const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		app: './src/index.ts',
	},
	output: {
		path: path.join(__dirname, 'build'),
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
