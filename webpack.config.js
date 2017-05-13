const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');


const javascript = {
  test: /\.(js)$/, // match anything that ends in `.js`
  use: [{
    loader: 'babel-loader',
    options: { presets: ['es2015'] }
  }],
};


const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
  }
};

const styles = {
  test: /\.(scss)$/,
  use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap'])
};

const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
  compress: { warnings: false }
});

// Put it all together
const config = {
  entry: {
    App: './public/javascripts/nodeapp.js'
  },
  // specifies which kind of sourcemap to use
  devtool: 'source-map',

  output: {

    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },


  module: {
    rules: [javascript, styles]
  },

  plugins: [
    // output css to a separate file
    new ExtractTextPlugin('style.css'),
  ]
};
// webpack is cranky about some packages using a soon to be deprecated API.
process.noDeprecation = true;

module.exports = config;
