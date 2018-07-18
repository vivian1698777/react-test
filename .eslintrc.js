module.exports = {
    env: {
        node: true,
        browser: true,
      },    
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules" : {
        "prefer-arrow-callback": 0,
        "func-names": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        'consistent-return': 0,
        'function-paren-newline': 0,
        'global-require': 0,
        'import/no-dynamic-require': 0,
        'no-console': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'no-use-before-define': 0,
        'prefer-destructuring': 0,
        "react/no-array-index-key": 0,
    },
};

