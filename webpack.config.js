var path = require('path')

module.exports = {
  // This is the main file that should include all other JS files
  entry: {
    app: './client/scripts/main.js'
  },

  target: 'web',
  devtool: 'source-map',
  debug: true,
  watch: false,

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      }
    ]
  }
}
