const path = require('path')
var prod = /production$/.test(process.env.NODE_ENV)
const LessPluginAutoPrefix = require('less-plugin-autoprefix')

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: !prod,
  build: {
  },
  resolve: {
    alias: {
      mock: path.join(__dirname, 'src/mock'),
      images: path.join(__dirname, 'src/images'),
      components: path.join(__dirname, 'src/components'),
      service: path.join(__dirname, 'src/services'),
      util: path.join(__dirname, 'src/utils'),
      config: path.join(__dirname, 'src/config/index.js'),
      stat: path.join(__dirname, 'src/stat'),
      '@': path.join(__dirname, 'src')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    less: {
      compress: prod,
      plugins: [new LessPluginAutoPrefix({browsers: ['Android >= 2.3', 'Chrome > 20', 'iOS >= 6']})]
    },
    /* sass: {
      outputStyle: 'compressed'
    }, */
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions'
      ]
    }
  },
  plugins: {
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (prod) {
  // 压缩sass
  // module.exports.compilers['sass'] = {outputStyle: 'compressed'}

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {
        compress: {
          dead_code: true,
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
