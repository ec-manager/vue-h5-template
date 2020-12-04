module.exports = {
	"env": {
		"es6": true,
		"node": true,
		"browser": true
	},
	"extends": [
		"eslint:recommended"
	],
	"globals": {
		"Vue": true,
		"weex": true
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [],
	"rules": {
		"semi": 0,
		"comma-dangle": [
			2,
			"never"
		],
		"no-undef-init": 2,
		"no-irregular-whitespace": [
			2,
			{
				"skipComments": true
			}
		],
		"block-scoped-var": 2,
		"curly": 2,
		"dot-location": [
			2,
			"property"
		],
		"no-eq-null": 2,
		"no-extra-bind": 2,
		"no-fallthrough": [
			2,
			{
				"commentPattern": "break[\\s\\w]*omitted"
			}
		],
		"no-floating-decimal": 2,
		"no-implied-eval": 2,
		"no-iterator": 2,
		"no-lone-blocks": 2,
		"no-multi-str": 2,
		"no-proto": 2,
		"no-return-assign": 2,
		"no-sequences": 2,
		"no-useless-return": 2,
		"semi-spacing": 2,
		"no-unused-vars": 2,
		"space-infix-ops": 2,
		"comma-spacing": [
			2,
			{
				"after": true
			}
		],
		"block-spacing": [
			2
		],
		"key-spacing": [
			2,
			{
				"afterColon": true,
				"beforeColon": false
			}
		],
		"no-eval": 2,
		"no-multi-spaces": 2,
		"no-new-wrappers": 2,
		"valid-jsdoc": [
			2,
			{
				"prefer": {
					"arg": "param",
					"argument": "param"
				},
				"requireReturn": false,
				"requireParamDescription": false,
				"requireReturnDescription": false
			}
		],
		"no-cond-assign": [
			2,
			"always"
		],
		"quotes": [
			2,
			"single",
			{
				"allowTemplateLiterals": true
			}
		],
		"no-multiple-empty-lines": [
			2,
			{
				"max": 1
			}
		],
		"space-before-function-paren": 2,
		"keyword-spacing": 2,
		"operator-linebreak": 2,
		"no-unneeded-ternary": 2,
		"no-whitespace-before-property": 2,
		"space-unary-ops": [
			2,
			{
				"words": true,
				"nonwords": false
			}
		],
		"spaced-comment": 2,
		"brace-style": 2,
		"space-before-blocks": 2,
		"no-console": 1,
		"no-alert": 1,
		"no-caller": 1,
		"indent": [
			1,
			4,
			{
				"SwitchCase": 1
			}
		],
		"no-unexpected-multiline": 0
	}
}