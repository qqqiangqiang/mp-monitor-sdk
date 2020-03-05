const path = require('path')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner =
  `/*!
  * mp-monitor-sdk v${version}
  * (c) ${new Date().getFullYear()} dongzhiqiang
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  // browser dev
  {
    file: resolve('dist/mp-monitor-sdk.js'),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve('dist/mp-monitor-sdk.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve('dist/mp-monitor-sdk.common.js'),
    format: 'cjs'
  },
  {
    file: resolve('dist/mp-monitor-sdk.esm.js'),
    format: 'es'
  },
  {
    file: resolve('dist/mp-monitor-sdk.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false
  },
  {
    file: resolve('dist/mp-monitor-sdk.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false
  }
].map(genConfig)

function genConfig(opts) {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        flow(),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        })
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'MpMonitorSdk'
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  if (opts.transpile !== false) {
    const babelConfig = {
      exclude: "node_modules",
      babelrc: false,
      presets: [
        [
          "@babel/preset-env", {
            modules: false,
            targets: ["last 1 version", "not dead", "> 0.2%"]
          }
        ]
      ]
    }
    config.input.plugins.push(babel(babelConfig))
  }

  return config
}
