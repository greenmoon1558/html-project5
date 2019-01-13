const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const posrcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const postcssCssnext = require("postcss-cssnext");
const cssNano = require("cssnano");
const postcssExtractMediaQuery = require("postcss-extract-media-query");
let getConfig = (env) => {
  return {
    entry: [
      "@babel/polyfill",
      `./src/js/index.js`,
      `./src/scss/index.scss`
    ],
    output: {
      path: path.resolve(__dirname, `dist`),
      filename: "[name].[chunkhash].js"
    },
    target: "web",
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, "./"),
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { sourceMap: true, minimize: true, url: false }
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: loader => [
                  posrcssImport({ root: loader.resourcePath }),
                  postcssPresetEnv(),
                  postcssCssnext({
                    browsers: ["> 1%", "ie 10"]
                  }),
                  cssNano(),
                  env.WEBPACK_MODE.indexOf('production') != -1 ? postcssExtractMediaQuery({
                    output: {
                      path: path.join(__dirname, `dist`),
                      name: '[query].css'
                    },
                    minimize: true,
                    combine: true,

                  }) : () => { },
                ],
              }
            },
            { loader: "sass-loader", options: { sourceMap: true } }
          ]
        },
        {
          test: /\.html$/,
          include: [path.resolve(__dirname, "src/html/includes")],
          use: ["raw-loader"]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin("dist", {}),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: `./src/html/views/index.html`,
        filename: `index.html`
      }),
      new CopyWebpackPlugin([
        {
          from: "./src/fonts",
          to: "./fonts"
        },
        {
          from: "./src/favicon",
          to: "./"
        },
        {
          from: "./src/img",
          to: "./img"
        },
        {
          from: "./src/uploads",
          to: "./uploads"
        }
      ]),
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
      new PreloadWebpackPlugin({
        rel: "preload",
        as: "style"
      }),
      new WebpackMd5Hash()
    ],
  };
}

module.exports = getConfig;
