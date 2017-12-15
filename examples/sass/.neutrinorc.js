module.exports = {
  use: [
    ['tux/neutrino', {
      style: {
        loaders: [
          require.resolve('sass-loader'),
        ],
      }
    }]
  ]
}
