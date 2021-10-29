'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'E-Digital' // Title

const port = process.env.port || process.env.npm_config_port || 80 // port

// vue.config.js configuration instructions
// Only a part is listed here, please refer to the documentation for specific configuration
module.exports = {
  // Deploy URLs in the production environment and development environment.
  // By default, Vue CLI will assume that your application is deployed on the root path of a domain name
  // For example https://www.devteamvietban.com/. If the application is deployed on a subpath, you need to specify this subpath with this option. For example, if your application is deployed at https://www.devteamvietnam.com/admin/, set baseUrl to /admin/.
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // In npm run build or yarn build, the directory name of the generated file (must be consistent with the production environment path of baseUrl) (default dist)
  outputDir: 'dist',
  // Used to place the generated static resources (js, css, img, fonts); (after the project is packaged, the static resources will be placed in this folder)
  assetsDir: 'static',
  // Whether to enable eslint save detection, valid value: ture | false |'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // If you don't need the source map of the production environment, you can set it to false to speed up the production environment construction.
  productionSourceMap: false,
  // webpack-dev-server related configuration
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:9090`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single'),
          {
            from: path.resolve(__dirname, './public/robots.txt'), // anti-crawler file
            to: './' // to the root directory
          }
        }
      )
  }
}
