### 入门
1. `npm init` 初始化npm
2. 创建入口文件，`src/main.js`
3. 执行`npm i -D webpack webpack-cli`安装`webpack`
3. 根据入口文件配置配置打包命令 `in package.json`
```
"scripts": {
  "build": "webpack src/main.js"
}
```
运行 `npm run build`

### 基础
1. 模式、入口文件及打包输出配置
```
module.exports = {
  // 模式
  mode: 'development',
  // 入口文件路径
  entry: path.resolve(__dirname, './src/main.js'), // __dirname 变量 是以文件所处的路径为值
  // 打包输出路径
  output: {
    filename: '[name].[hash:8].js', // 实际开发中一般会给打包后的文件加上hash后缀
    path: path.resolve(__dirname, './dist')
  }
}
```
2. `npm i -D html-webpack-plugin`将webpack打包出来的js文件引入到index.html中
```
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}
```
3. `clean-webpack-plugin`每次打包前删除上次打包的文件
4. CSS引入
```
npm i -D style-loader css-loader
npm i -D less less-loader
// dart scss
npm install sass-loader sass webpack --save-dev
```