module.exports = {
  use: [
    [
      'tux/neutrino',
      {
        html: {
          document: 'src/Html',
        },
      },
    ],
    'tux-addon-admin/neutrino',
    neutrino =>
      neutrino.config
        .entry('vendor')
        .add('react')
        .add('react-dom'),
  ],
}
