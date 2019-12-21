const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			}
		]
	},
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'app.js'
	},
	devServer: {
		publicPath: '/',
		contentBase: './public',
		hot: true
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html"
		})
	]
};