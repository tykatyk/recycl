const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './public/client.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
}
