const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/scripts/index.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.[contenthash].js",
    publicPath: "",
    clean: true,
  },

  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",

  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },

  target: ["web", "es5"],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      // make <img src="./images/..."> in HTML work (and copy assets)
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // extract CSS imported from JS
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1, url: true } },
          "postcss-loader",
        ],
      },
      // images / fonts / icons referenced by HTML, CSS, or JS
      {
        test: /\.(png|svg|jpe?g|webp|gif|ico|woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][hash][ext][query]",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      // IMPORTANT: run html through html-loader so asset URLs are rewritten
      template: "!!html-loader!./src/index.html",
      inject: "body",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
  ],
};
