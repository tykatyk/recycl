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
  entry: ['./server/server.js'],
  output: {
    path: path.join(__dirname, 'build/server'),
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
            // include: path.join(__dirname, 'server')
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
              // emitFile: false,
              // outputPath: '/build/client/images',
              include: path.join(__dirname, 'src/images')
            }
          }
        ]
      }
    ]
  },
  externals: [nodeExternals()],
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 500,
    ignored: /node_modules/
  }

  /* stats: {
    excludeModules: false,
    maxModules: Infinity,
    exclude: undefined,
    modules: true
  } */
}
