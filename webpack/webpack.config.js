const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production'; //prettier-ignore
const FILENAME = pkg.name + (isProduction ? '.min' : '');
const BANNER = [
  'Duplication of Image',
  '@version ' + pkg.version + ' | ' + new Date().toDateString(),
  '@author ' + pkg.author,
  '@license ' + pkg.license,
].join('\n');

const config = {
  entry: './src/duplicateDraw.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: FILENAME + '.js',
    library: ['DuplicateDraw'],
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: BANNER,
      entryOnly: true,
    }),
  ],
};

module.exports = config;
