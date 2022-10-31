module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        project: "./tsconfig.json"
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-floating-promises": "error",
        "accessor-pairs": "error",
        "array-bracket-newline": ["error", "consistent"],
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "array-callback-return": "error",
        "array-element-newline": "off",
        "arrow-body-style": "error",
        "arrow-parens": [
            "error",
            "as-needed",
            {
                "requireForBlockBody": true
            }
        ],
        "arrow-spacing": [
            "error",
            {
                "after": true,
                "before": true
            }
        ],
        "block-scoped-var": "error",
        "block-spacing": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "camelcase": "error",
        "class-methods-use-this": "error",
        "comma-dangle": "error",
        "comma-spacing": [
            "error",
            {
                "after": true,
                "before": false
            }
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "complexity": "error",
        "computed-property-spacing": "error",
        "consistent-return": "error",
        "consistent-this": "error",
        "curly": "off",
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-location": ["error", "property"],
        "dot-notation": [
            "error",
            {
                "allowKeywords": true
            }
        ],
        "eol-last": "error",
        "eqeqeq": "off",
        "func-call-spacing": "error",
        "func-name-matching": "error",
        "func-names": "error",
        "func-style": [
            "error",
            "declaration"
        ],
        "function-paren-newline": "off",
        "generator-star-spacing": "error",
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "id-denylist": "error",
        "id-length": "off",
        "id-match": "error",
        "implicit-arrow-linebreak": [
            "error",
            "beside"
        ],
        "indent": "error",
        "init-declarations": "off",
        "jsx-quotes": "error",
        "key-spacing": "error",
        "keyword-spacing": [
            "error",
            {
                "after": true,
                "before": true
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "lines-around-comment": "error",
        "max-classes-per-file": "error",
        "max-depth": "error",
        "max-len": "off",
        "max-lines": "error",
        "max-lines-per-function": "error",
        "max-nested-callbacks": "error",
        "max-params": "error",
        "max-statements-per-line": "error",
        "new-parens": "error",
        "newline-per-chained-call": "error",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-await-in-loop": "error",
        "no-caller": "error",
        "no-confusing-arrow": "error",
        "no-console": "off",
        "no-constructor-return": "error",
        "no-continue": "error",
        "no-div-regex": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-extra-parens": "off",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-loss-of-precision": "error",
        "no-magic-numbers": "off",
        "no-mixed-operators": "off",
        "no-multi-assign": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-promise-executor-return": "off",
        "no-proto": "error",
        "no-restricted-exports": "error",
        "no-restricted-globals": "error",
        "no-restricted-imports": "error",
        "no-restricted-properties": "error",
        "no-restricted-syntax": "error",
        "no-return-assign": "off",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow": "error",
        "no-tabs": "error",
        "no-template-curly-in-string": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-optional-chaining": "error",
        "no-unused-expressions": "error",
        "no-use-before-define": "error",
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-void": ["error", { "allowAsStatement": true }],
        "no-warning-comments": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": "error",
        "object-curly-spacing": "off",
        "object-property-newline": "off",
        "object-shorthand": "error",
        "one-var": "off",
        "one-var-declaration-per-line": "error",
        "operator-assignment": "error",
        "operator-linebreak": ["error", "before"],
        "padded-blocks": "off",
        "padding-line-between-statements": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-named-capture-group": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "quote-props": "off",
        "quotes": [
            "error",
            "double"
        ],
        "radix": "error",
        "require-atomic-updates": "error",
        "require-await": "error",
        "require-unicode-regexp": "error",
        "rest-spread-spacing": [
            "error",
            "never"
        ],
        "semi": "error",
        "semi-spacing": "error",
        "semi-style": [
            "error",
            "last"
        ],
        "sort-keys": "off",
        "sort-vars": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": "off",
        "space-in-parens": [
            "error",
            "never"
        ],
        "space-infix-ops": "off",
        "space-unary-ops": "error",
        "spaced-comment": [
            "error",
            "always"
        ],
        "strict": "error",
        "switch-colon-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": [
            "error",
            "never"
        ],
        "template-tag-spacing": "error",
        "unicode-bom": [
            "error",
            "never"
        ],
        "vars-on-top": "error",
        "wrap-iife": "error",
        "wrap-regex": "error",
        "yield-star-spacing": "error",
        "yoda": [
            "error",
            "never"
        ]
    }
};
