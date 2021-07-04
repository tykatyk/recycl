import path from 'path'
import webpack from 'webpack'

export default {
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?&path=/__webpack_hmr&timeout=20000',
    './client/client.jsx'
  ],
  output: {
    path: path.join(__dirname, 'build', 'public', 'js'),
    publicPath: '/',
    filename: 'client.js'
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
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
