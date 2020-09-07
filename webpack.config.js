const path = require('path')

// 将webpack打包出来的js文件引入到index.html中,可进行多入口文件设置
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 每次打包前删除上次打包的文件
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
// 拆分CSS
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  // 模式
  mode: 'development',
  // 入口文件路径 
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname,'./src/main.js')],
    header: ['@babel/polyfill', path.resolve(__dirname,'./src/main.js')],
  },
  // __dirname 变量 是以文件所处的路径为值
  // 打包输出路径
  output: {
    filename: '[name].[hash:8].js', // 实际开发中一般会给打包后的文件加上hash后缀
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options:{
              presets:['@babel/preset-env']
            }
          }
        ],
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader:'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'images/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 删除上次打包的文件
    new HtmlWebpackPlugin({
      // 入口模版文件
      template: path.resolve(__dirname, './public/index.html'),
      // 打包后生成的文件
      filename: 'index.html',
      // 与入口文件对应的模块名
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'header.html',
      chunks: ['header']
    }),
    // 拆分CSS
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].css'
    })
  ]
}