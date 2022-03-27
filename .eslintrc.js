module.exports = {
	extends: ['xo', 'xo-typescript'],
	env: {
		node: true,
		browser: true,
		jest: true
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	parserOptions: {
		project: './tsconfig.json'
	},
	rules: {
		'prettier/prettier': 'error',
		'comma-dangle': ['error', 'never'],
		'@typescript-eslint/comma-dangle': ['error', 'never'],
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/no-confusing-void-expression': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/object-curly-spacing': ['error', 'always']
	},
	overrides: []
};
