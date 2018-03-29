const webpack = require('webpack');
const config = require('sapper/webpack/config.js');
const pkg = require('../package.json');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
	entry: config.server.entry(),
	output: config.server.output(),
	target: 'node',
	resolve: {
		extensions: ['.js', '.json', '.html']
	},
	externals: Object.keys(pkg.dependencies),
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: false,
						cascade: false,
						store: true,
						generate: 'ssr'
					}
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			ENV: JSON.stringify(require(`../environments/${isDev ? 'dev' : 'prod'}.config.js`))
		})
	],
	mode: process.env.NODE_ENV,
	performance: {
		hints: false // it doesn't matter if server.js is large
	}
};