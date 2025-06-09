const path = require('path');

module.exports = {
  // ...các config khác như entry, output
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/flast-chat'),
          path.resolve(__dirname, 'node_modules/ml-matrix')
        ],
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['react-app'],
          plugins: [
            '@babel/plugin-proposal-class-properties', 
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-transform-modules-commonjs',
            '@babel/plugin-proposal-logical-assignment-operators'
          ]
        }
      }
    ]
  }
}
