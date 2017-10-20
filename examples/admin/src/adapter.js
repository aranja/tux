import createContentfulAdapter from 'tux-adapter-contentful'

const publicUrl = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : process.env.TUX_BUILD_TARGET === 'server'
    ? 'https://localhost:5000'
    : `${location.protocol}//${location.host}/`

export default createContentfulAdapter({
  space: process.env.TUX_CONTENTFUL_SPACE_ID || 'n2difvpz16fj',
  accessToken:
    process.env.TUX_CONTENTFUL_ACCESS_TOKEN ||
    '61344f3579f7f80450ffc4bc7111624e1035c9588e9680c02519bce08bbbc3ca',
  applicationUid:
    process.env.TUX_CONTENTFUL_APPLICATION_UID ||
    '5be3eeb398764037af2e860d1933bc9518d2f71a72cade411c5f5260e8dd9335',
  host: 'preview.contentful.com',
  redirectUri: publicUrl,
})
