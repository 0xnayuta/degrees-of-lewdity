export default {
	"*.{js,cjs,mjs}": "eslint --cache --fix",
	"*.css": [
		"postcss --replace --no-map",
		"stylelint --fix",
	],
	// Format other files with Prettier
	"!(*.{js,cjs,mjs,css,yml})": "prettier --ignore-unknown --write",
};
