const tuxOptions = {
  html: {
    document: 'src/Html',
  },
}

function vendorBundle({ config }) {
  return config
    .entry('vendor')
    .add('react')
    .add('react-dom')
}

module.exports = {
  use: [
    ['tux/neutrino', tuxOptions],
    ['tux-addon-admin/neutrino'],
    vendorBundle,
  ],
}
