const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = [{
  entry: './src/main/js/index.ts',
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin({sourceMap: true})
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/src.test/],
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'dist/izi.js',
    libraryTarget: 'umd'
  }
}]
