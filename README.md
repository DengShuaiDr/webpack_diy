### Beginner
1. `npm init` init project with npm;
2. Create entry,`src/main.js`;
3. Run command `npm i -D webpack webpack-cli` to install`webpack`;
3. Config the packing command `in package.json` according to the path of entry file.
```javascript
"scripts": {
  "build": "webpack src/main.js"
}
```
run command `npm run build`,and then you will get packaged file `dist`.
### Basic
1. development enviroment,entry file and the configuration of output
```javascript
module.exports = {
  // development environment
  mode: 'development',
  // path of entry file
  // The value of '__dirname' is the path of file 'webpack.config.js'
  entry: path.resolve(__dirname, './src/main.js'),
  // configuration of output
  output: {
    // The suffix of hash will be always added to the packaged file
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, './dist')
  }
}
```
2. `html-webpack-plugin` will import the packaged js file into `index.html`
> run `npm i -D html-webpack-plugin` to install
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // Omit other configurations...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}
```
3. `clean-webpack-plugin` will help you to delete expired files before packing
> run `npm i -D clean-webpack-plugin` to install
```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Omit other configurations...
plugins: [
  new CleanWebpackPlugin()
]
```
4. Import CSS
We usually use some loader to process CSS,here are some usually used loaders
* style-loader css-loader
* less-loader
* sass-loader run  
If you want to learn more loaders, [clice here](https://webpack.js.org/loaders/)  
>`npm i -D style-loader css-loader`  
`npm i -D less less-loader`  
`npm i -D sass-loader sass webpack`
```javascript
module: {
  rules: [
    {
      test: '/\.css/',
      use: ['style-loader', 'css-loader']
    },
    {
      /**
      * dart-sass,if you want 'node-scss',
      * please refer 'https://www.npmjs.com/package/sass-loader'.
      */
      test: '/\.scss/',
      use: [
        'style-loader',
        'css-loader',
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
5. `postcss-loader autoprefixer` will help you to add browser prefix automatically
> `npm i -D postcss-loader autoprefixer`

There are two ways to use it.
* First, you need to create file 'postcss.config.js' in root directory.The configuration is as follows:
```javascript
module.exports = {
  plugins: [require('autoprefixer')]
}
```
* Then in the position of code 'css-loader' in file 'webpack.config.js'
```javascript
module: {
  rules: [
    // Omit other configurations...
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
* The other way is use it directlly
```javascript
module: {
  rules: [
    // Omit other configurations...
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
When accomplished,you will find there is no CSS file when you packaged. And all CSS is written in page by **style** way. So we need to separate CSS from page.  
6. `mini-css-extract-plugin` can do this.
> `npm i -D mini-css-extract-plugin`

**style-loader** replace by **MiniCssExtractPlugin.loader**
```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module: {
  rules: [
    // Omit other configurations...
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
This will merge all CSS into the same file, with one file in each entry.  
7. `extract-text-webpack-plugin@next`  
8. `url-loader` and `file-loader` help you pack other type of file. After handle files, `file-loader` will move the file into output directory. When used with `url-loader`, you can get base64 encode after the file size is limited. Otherwise, the processing is the same as `file-loader`.
> npm install --save-dev url-loader  
npm install --save-dev file-loader
```javascript
module: {
  rules: [
    // Omit other configurations...
    /**
    * There is the configuration of pack images.
    * You can package other types of files by modifying 'test'
    */
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
9. Use Babel to escape JS file  
In order to be compatible with more enviroment, we usually use `babel-loader` to translate 'ES6/7/8' grammar into 'ES5'. However, some new API, like promise,Generator,Set,Maps,Proxy and so on, would not be escaped by `babel-loader`. So we also need to use `babel-polyfill`  
> npm i babel-loader @babel/preset-env @babel/core  
npm i @babel/polyfill
```javascript
// babel-loader
module: {
  // Omit other configurations...
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