import path from 'path'
import webpack from 'webpack'

export default {
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?&path=/__webpack_hmr&timeout=20000',
    './components/App.jsx'
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
              outputPath: './build/public/fonts'
            }
          }
        ]
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
