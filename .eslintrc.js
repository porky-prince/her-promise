module.exports = {
	extends: ['xo', 'xo-typescript'],
	env: {
		node: true,
		browser: true,
		jest: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		'prettier/prettier': 'error',
		'comma-dangle': [
			'error',
			{
				objects: 'always',
			},
		],
		'@typescript-eslint/no-floating-promises': 'off',
	},
	overrides: [],
};
