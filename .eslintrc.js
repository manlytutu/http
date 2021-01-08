/**
 * .eslintrc.js 文件描述 eslint 语法检查和 ts 类型检查的规则
 */
const path = require('path')
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    },
    plugins: ["@typescript-eslint"],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    }
}