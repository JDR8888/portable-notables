const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { InjectManifest, generateSW } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.
const path = require('path');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Webpack Plugin',
      }),
      new MiniCssExtractPlugin(),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'service-worker.js'
      }),
      new GenerateSW({
				// excludes images from being cached initially
				exclude: [/\.(?:png|jpg|jpeg|svg)$/],

				// runtime caching for images
				runtimeCaching: [
					{
						urlPattern: /.(?:png|jpg|jpeg|svg)$/,
						handler: "CacheFirst",

						options: {
							cacheName: "images",
							expiration: { maxEntries: 10 },
						},
					},
				],
			}),
      new WebpackPwaManifest({
				// sets name and short name for app
				name: "Text Editor",
				short_name: "JATE",
				// sets background color for app
				background_color: "#FFFFFF",
				// sets display as standalone and orientation portrait
				display: "standalone",
				orientation: "portrait",
				// disables fingerprinting
				fingerprints: false,
				// set publicPath
				publicPath: "./",
				// set icon src and destination (and sizes that are saved)
				icons: {
					src: path.resolve("src/images/logo.png"),
					sizes: [96, 120, 152, 167, 180, 1024],
					destination: path.join("assets", "icons"),
				},
			}),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};
