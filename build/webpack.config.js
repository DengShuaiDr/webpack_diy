const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: { // more than one entry
    main: path.resolve(__dirname, '../src/main.js'),
    login: path.resolve(__dirname, '../src/login.js')
  }, // the entry of building
  output: {
    filename: '[name].[hash:8].js', // output filename of built
    path: path.resolve(__dirname, '../dist') // directory of built
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main'] // match the name of file in entry
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/login.html'),
      filename: 'login.html',
      chunks: ['login'] // // match the name of file in entry
    }),
    require('autoprefixer')
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('sass'),
            }
          }
        ]
      }
    ]
  }
}