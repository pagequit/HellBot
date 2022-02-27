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
		'@typescript-eslint/quotes': ['warn', 'single', { 'avoidEscape': true }],
		'semi': 'off',
		'@typescript-eslint/semi': ['warn', 'always'],
		'indent': 'off',
		'@typescript-eslint/indent': ['warn', 'tab'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['warn', { 'args': 'none'}],
	},
};
