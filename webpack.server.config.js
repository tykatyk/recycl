const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  mode: 'development',
  devtool: 'source-map',
  entry: ['./server.js'],
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
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './build/public/img',
              include: path.join(__dirname, 'build/public/img')
            }
          }
        ]
      }
    ]
  },
  externals: [nodeExternals()]
}
