const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  node: {
  __dirname: false,
  __filename: false
},
  mode: 'development',
  entry: [
    './server.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'server.js'
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
  externals: [nodeExternals()]
};
