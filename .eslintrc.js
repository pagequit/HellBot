module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	env: {
		'node': true,
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'quotes': 'off',
		'@typescript-eslint/quotes': ['error', 'single', { 'avoidEscape': true }],
		'semi': 'off',
		'@typescript-eslint/semi': ['error', 'always'],
		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
	},
};
