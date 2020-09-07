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
  // 省略其他配置...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}
```
3. `clean-webpack-plugin`每次打包前删除上次打包的文件
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 省略其他配置...
plugins: [
  new CleanWebpackPlugin()
]
```
4. CSS引入
```
npm i -D style-loader css-loader
npm i -D less less-loader
// dart scss
npm install sass-loader sass webpack --save-dev
module: {
  rules: [
    {
      test: '/\.css/',
      use: ['style-loader', 'css-loader']
    },
    {  // dart-sass
      test: '/\.scss/',
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sacc')
          }
        }
      ]
    }
  ]
}
```
5. `npm i -D postcss-loader autoprefixer`添加浏览器前缀,有两种使用方式
* 需在项目根目录下创建一个postcss.config.js文件,配置如下
```
module.exports = {
  plugins: [require('autoprefixer')]
}
```
* 在webpack.config.js的样式loader处
```
module: {
  rules: [
    // 省略其他配置...
    {
      test: '/\.scss/',
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sacc')
          }
        }
      ]
    }
  ]
}
```
* 直接引用
```
module: {
  rules: [
    // 省略其他配置...
    {
      test: '/\.scss/',
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader'
          options: {
            plugins: [require('autoprefixer')]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sacc')
          }
        }
      ]
    }
  ]
}
```
> 以上做法,打包后会发现打包文件中并没有CSS相关文件,所有CSS样式都以*style*的方式直接写入到页面中,因此我们需要对CSS进行拆分
6. `npm i -D mini-css-extract-plugin`拆分CSS,将*style-loader*替换为*MiniCssExtractPlugin.loader*
```
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module: {
  rules: [
    // 省略其他配置...
    {
      test: '/\.scss/',
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader'
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
    }
  ]
}
```
> 此做法会将所有CSS合并为同一个文件,每个入口对应一个CSS文件,实际开发中,往往需要差分多个CSS
7. `npm i -D extract-text-webpack-plugin@next`差分多个CSS
8. 其他类型文件的打包,`url-loader`与`file-loader`配合使用;`file-loader`在对文件进行处理后,会将文件移动到输出目录;配合`url-loader`使用,在限制文件大小后,会输出base64编码,否则处理方式同使用`file-loader`
> npm install --save-dev url-loader
> npm install --save-dev file-loader
```
module: {
  rules: [
    // 省略其他配置...
    // 只简单写了下关于部分图片的打包配置;文件,字体等资源的打包只是test匹配不同
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
}

```
9. 用babel转义js文件
为了使我们的js代码兼容更多的环境,我们经常会借用`babel-loader`把ES6/7/8语法转换为ES5语法;然而,一些新的API,例如promise、Generator、Set、Maps、Proxy等,`babel-loader`也不会对其进行转义,我们还需借助`babel-polyfill`来实现
> npm i babel-loader @babel/preset-env @babel/core
> npm i @babel/polyfill
```
// babel-loader
module: {
  // 省略其他配置...
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options:{
          presets:['@babel/preset-env']
        }
      },
      exclude: '/node_modules/'
    }
  ]
}
// babel-polyfill
entry: {
  main: ['@babel/polyfill', path.resolve(__dirname,'./src/main.js')],
  header: ['@babel/polyfill', path.resolve(__dirname,'./src/main.js')],
}
```