const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
console.log(isDev);

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]?[hash]"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      favicon: "./src/assets/image/heeil_icon.ico"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "" }
      ]
    })
  ],
  devtool: isDev ? "eval-source-map" : "source-map",
  devServer: isDev ? {
    static: {
      directory: path.join(__dirname, "public")
    },
    historyApiFallback: true,
    compress: true,
    port: 8080,
    hot: true,
    proxy: {
      "/": {
        target: "https://api.heeil.com/v1/h3",
        changeOrigin: true
      }
    }
  } : undefined
};
