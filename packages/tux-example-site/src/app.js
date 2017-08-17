import createContentfulAdapter from 'tux-adapter-contentful';
import routes from './routes';
import router from './middleware/router';
import tux from './middleware/tux';
import hot from './middleware/hot';
import history from 'react-chain-history';
import helmet from 'react-chain-helmet';
import createReactChain from 'react-chain';

import './reset.css';
import './index.css';
import './megadraft.css';
import './megadraft-fixes.css';

const publicUrl = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : process.env.SERVER
      ? 'https://localhost:5000'
      : `${location.protocol}//${location.host}/`;

const adapter = createContentfulAdapter({
  accessToken: 'e3e74d846929d5ee9f748d36a40f106fbd08a32c6d1dad8d9707c8dd4d9df2f5',
  clientId: '5be3eeb398764037af2e860d1933bc9518d2f71a72cade411c5f5260e8dd9335',
  host: 'preview.contentful.com',
  redirectUri: publicUrl,
  space: 'p58cwyy6iobr',
});

export default createReactChain()
  .chain(history())
  .chain(
    hot(refresh => {
      module.hot.accept('./routes', refresh);
    }),
  )
  .chain(tux({adapter}))
  .chain(helmet())
  .chain(router(routes));
