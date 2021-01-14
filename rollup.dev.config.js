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

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import merge from 'lodash.merge'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import baseConfig from './rollup.base.config'


const extensions = ['.js', '.ts'];
export default merge(baseConfig, {   
    plugins: [
      nodeResolve(), 
      nodePolyfills(),
      commonjs(),
      babel({
          exclude: 'node_modules/**',
          extensions,
          runtimeHelpers:true,
      }),
      livereload(),
      serve({
        host:'10.8.27.168',
        port: 4000,
        openPage: './index.html', // 打开的页面
        contentBase: ''
      })
    ]
})