
# 基于Rollup, Babel, Eslint搭建ts开发环境
Rollup + Babel + TypeScript + ESLint
## 一、配置typescript
---
  1. 安装typescript
  2. 编写tsconfig.json  (命令行 tsc --init)
## 二、配置rollup babel套件
---
#### 安装依赖
  1. rollup 
  2. rollup-plugin-babel 
  3. @rollup/plugin-node-resolve
  4. @babel/core 
  5. @babel/preset-env 
  6. @babel/preset-typescript
#### 添加 .babelrc配置文件
```
  {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ]
  }
```
#### 添加rollup.config.js配置文件
```
export default {   
    input: dealPath('./src/main.ts'),
    output:{
        name:'bndle',
    },
    plugins: [
        resolve({
            extensions,
            modulesOnly: true,
        }),
        commonjs(), // convert other modules to an ES module
        babel({
            exclude: 'node_modules/**',
            extensions, //['.js','.ts']
        }),
    ]
}
```
#### 三、配置 npm scripts
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "clean":"rm -rf dist",
    "declaration":"rm -rf types && tsc -d",
    "dev": "npm run clean && rollup -w -c ./rollup.base.config.js --environment FORMAT:esm",
    "build:esm": "rollup -c ./rollup.base.config.js --environment FORMAT:esm",
    "build:umd": "rollup -c ./rollup.base.config.js  --environment FORMAT:umd",
    "build:cjs": "rollup -c ./rollup.base.config.js  --environment FORMAT:cjs",
    "build":"npm run clean && npm run build:esm && npm run build:umd && npm run build:cjs",
    "lint": "eslint 'src/**/*.{js,ts}'"
},
```
```
  "main": "dist/bundle.cjs.js",
  "module": "dist/bundle.esm.js",
  "browser": "dist/bundle.umd.js",
```
## 配置eslint prettier
---
支持代码的类型校验，语法校验，以及代码格式化
#### 1. 安装依赖
```
# 安装 eslint 套件
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 安装 prettier
yarn add -D prettier

# 安装 husky、lint-staged 套件
yanr add -D husky lint-staged
```
#### 2. 添加配置文件 .eslintrc.js
---
.eslintrc.js 文件描述 eslint 语法检查和 ts 类型检查的规则
```
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
```
#### 3. 添加配置文件 .prettierrc.json
---
.prettierrc 文件描述代码格式化的规则
```
{
  "semi":  true,
  "trailingComma":  "all",
  "singleQuote":  true,
  "printWidth":  120,
  "tabWidth":  2
}
```
#### 4. 修改package.json,配置husky和lint-staged
---
eslint 完整检查可能需要花费几分钟的时间。而 husky + lint-staged 可以实现只对提交的文件进行检查，从而提升开发效率。这样即使项目再大，也仅仅是检查本次提交的文件，只需几秒钟。
```
"scripts": {
    "lint": "eslint 'src/**/*.{js,ts}'"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*./src/**/*.{js,ts,json,css,less,md}": [
      "prettier --write",
      "yarn lint"
    ]
  },
```
上述配置可以实现在执行 git commit 时调用 prettier 格式化代码，并使用 eslint 做类型和语法的检查。
## 四、进一步完善
---
统一编辑器的行为，例如：空格，缩进等。并添加git忽略列表
#### 1. 添加.editorconfig 配置文件，编辑器安装相应的 editorconfig 插件，使该项目统一应用相同的空格、缩进等编码风格
```
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```
#### 2. 添加.gitignore 配置文件,设置git忽略列表
```
node_modules/
dist/
npm-debug.log
yarn-error.log
```