const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const { parseEnvVariables } = require("./env");
const outputDir = process.env.EXAMPLE === "true" ? "example/public" : "dist";

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    "excalidraw.development": "../../../excalidraw-app/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, outputDir),
    library: "ExcalidrawLib",
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "excalidraw-assets-dev/[name]-[contenthash].js",
    assetModuleFilename: "excalidraw-assets-dev/[name][ext]",
    publicPath: "",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer()],
              },
            },
          },
          "sass-loader",
        ],
      },
      // So that type module works with webpack
      // https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx|js|jsx|mjs)$/,
        exclude:
          /node_modules[\\/](?!(browser-fs-access|canvas-roundrect-polyfill))/,
        use: [
          {
            loader: "import-meta-loader",
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: path.resolve(__dirname, "../tsconfig.dev.json"),
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
        },
      },
    },
  },
  plugins: [
    new webpack.EvalSourceMapDevToolPlugin({ exclude: /vendor/ }),
    new webpack.DefinePlugin({
      "process.env": parseEnvVariables(
        path.resolve(__dirname, "../../../.env.development"),
      ),
    }),
  ],
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
  },
};
