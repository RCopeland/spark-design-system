const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './spark-exports-react.js',
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')]
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'index.js',
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      SPRK_REACT_CURRENT_VERSION: JSON.stringify(
        process.env.npm_package_version,
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
