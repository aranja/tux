module.exports = {
  use: [
    [
      'neutrino-preset-tux',
      {
        html: {
          document: 'src/Html',
        },
      },
    ],
    neutrino => neutrino.config.entry('vendor').add('react').add('react-dom'),
  ],
}
