/**
 * rollup-plugin-alias: 提供 modules 名称的 alias 和 reslove 功能.
 * rollup-plugin-babel: 提供 Babel 能力, 需要安装和配置 Babel (这部分知识不在本文涉及)
 * rollup-plugin-eslint: 提供 ESLint 能力, 需要安装和配置 ESLint (这部分知识不在本文涉及)
 * rollup-plugin-node-resolve: 解析 node_modules 中的模块
 * rollup-plugin-commonjs: 转换 CJS -> ESM, 通常配合上面一个插件使用
 * rollup-plugin-replace: 类比 Webpack 的 DefinePlugin , 可在源码中通过 process.env.NODE_ENV 用于构建区分 Development 与 Production 环境.
 * rollup-plugin-filesize: 显示 bundle 文件大小
 * rollup-plugin-uglify: 压缩 bundle 文件
 * rollup-plugin-serve: 类比 webpack-dev-server, 提供静态服务器能力
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import path from 'path';
import merge from 'lodash.merge';

const dealPath= function(...args){
    return path.resolve(__dirname, ...args)
}
// 打包任务的个性化配置
const jobs = {
    umd:{
        output:{
            name:'bndle',
            file: path.resolve(pkg.browser),
            format:'umd'
        } 
    },
    cjs:{
        output:{
            file: path.resolve(pkg.main),
            format:'cjs'
        }

    },
    esm:{
        output:{
            file: path.resolve(pkg.module),
            format:'esm'
        }
    }
}
// 从环境变量获取打包特征
const mergeConfig = jobs[process.env.FORMAT || 'esm'];


const extensions = ['.js', '.ts'];
export default merge({   
    input: dealPath('./src/main.ts'),
    output:{
        name:'bndle',
    },
    plugins: [
        resolve({
            extensions,
            modulesOnly: true,
        }), // so Rollup can find `ms`
        commonjs(), // so Rollup can convert `ms` to an ES module
        babel({
            exclude: 'node_modules/**',
            extensions,
        }),
    ]
},mergeConfig)