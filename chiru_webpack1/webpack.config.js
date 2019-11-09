// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
	const IS_DEVELOPMENT = argv.mode === 'development';
	return {
		mode: "development",
	  entry: {
	  	index: './src/js/index.js',
	  },
	  output: {
	    filename: 'js/[name].js',
	    path: path.join(__dirname, 'dist/'),
	  },
	  devServer: {
	  	contentBase: path.resolve(__dirname, './src'),
	  	watchContentBase: true,
	  	openPage: "index.html",//自動で指定したページを開く
	  	open:true,
	  	port: 3000,
	  },
	  devtool: IS_DEVELOPMENT ? 'source-map' : 'none',

	  // 最適化オプションを上書き
	  optimization: {
	    minimizer: IS_DEVELOPMENT ? [
	    	new OptimizeCssAssetsPlugin({})

	    ] : [
	    	new TerserPlugin({
	        terserOptions: {
	          compress: { drop_console: true }
	        }
	      }),
	      new OptimizeCssAssetsPlugin({})
	    ],
	    splitChunks: {
		    name: 'vendor',
		    chunks: 'initial',
		  }
	  },

	  module: {
	  	rules: [
	      {
	        // 拡張子 .js の場合
	        test: /\.js$/,
	        use: [
	          {
	            // Babel を利用する
	            loader: "babel-loader",
	            // Babel のオプションを指定する
	            options: {
	              presets: [
	                // プリセットを指定することで、ES2019 を ES5 に変換
	                "@babel/preset-env"
	              ]
	            }
	          }
	        ],
	        exclude: /node_modules/
	      },
	      // css/sass-loaderの設定
	      {
	        test: /\.(sa|sc|c)ss$/,
	        use: [
	        	MiniCssExtractPlugin.loader,
	          {
	            loader: 'css-loader',
	            options: {
	              url: true
	            }
	          },
	          {
              loader: 'postcss-loader',
              options: { plugins: [ require('postcss-nested') ] },
            },
	          'sass-loader'
	        ]
	      },
	      {
	        test: /\.(gif|jpg|png)$/,
	        use: [
	          {
	            loader: 'url-loader',
	            options: {
	              limit: 100 * 1024, // 100KB以上だったら埋め込まずファイルとして分離する
	              name: './images/[name].[ext]'
	            }
	          }
	        ]
	      },
	      {
	        // enforce: 'pre'を指定することによって
	        // enforce: 'pre'がついていないローダーより早く処理が実行される
	        // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
	        enforce: 'pre',
	        test: /\.js$/,
	        exclude: /node_modules/,
	        loader: 'eslint-loader'
	      },
	      {
	        test: /\.html$/,
	        loader: "html-loader"
	      }
	    ]
	  },
	  plugins: [
	  	new CleanWebpackPlugin(
	      {
	        // 除外するファイルやディレクトリを指定
	        exclude: ['images']
	      }
	    ),
	    new MiniCssExtractPlugin({
	      filename: './css/style.css',
	    }),
	    new webpack.ProvidePlugin({
	      $: 'jquery',
	      jQuery: 'jquery'
	    }),
	    new HtmlWebpackPlugin({
	      template: "./src/index.html"
	    })
	  ]
	}
};