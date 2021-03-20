import type { AppProps, AppContext } from 'next/app';

import { buildIsoAxios } from '../api/build-iso-axios';
import { UserContextProvider } from '../contexts/user-context';
import Header from '../components/header';

import 'bootstrap/dist/css/bootstrap.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider value={pageProps.currentUser}>
      <div>
        <Header />
        <div className="container">
          <Component {...pageProps} />
        </div>
      </div>
    </UserContextProvider>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const isoAxios = buildIsoAxios(context.ctx.req);
  const { data } = await isoAxios.get('/api/users/currentUser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    const nextPageProps = {
      ...context.ctx,
      isoAxios,
      currentUser: data.currentUser,
    };
    pageProps = await context.Component.getInitialProps(nextPageProps);
  }

  return { pageProps: { ...data, ...pageProps } };
};
