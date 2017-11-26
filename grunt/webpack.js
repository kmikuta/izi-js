const webpackConfig = require('../webpack.config')

module.exports.tasks = {
  webpack: {
    options: {
      stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    },
    prod: webpackConfig
  }
}
