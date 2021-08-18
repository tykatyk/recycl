// import path from 'path'
// import webpack from 'webpack'
const path = require('path')

// export default {
module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  entry: [
    // 'webpack-hot-middleware/client?&path=/__webpack_hmr&timeout=20000',
    './src/components/App.jsx'
  ],
  output: {
    path: path.join(__dirname, 'build/client'),
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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
              emitFile: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
              include: path.join(__dirname, 'src/images')
            }
          }
        ]
      }
    ]
  }
  /* watchOptions: {
    aggregateTimeout: 1000,
    poll: 500,
    ignored: /node_modules/
  } */
  /* plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ], */
  /* optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    }
  }, */
  /* stats: {
    excludeModules: false,
    maxModules: Infinity,
    exclude: undefined,
    modules: true
  },
  devServer: {
    contentBase: path.join(__dirname, '/build/client'),
    compress: true,
    port: 8000
  } */
}
