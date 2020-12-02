import type { AppProps, AppContext } from 'next/app';

import { isoAxios } from '../api/iso-axios';
import { UserContextProvider } from '../contexts/user-context';
import Header from '../components/header';

import 'bootstrap/dist/css/bootstrap.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider value={pageProps.currentUser}>
      <div>
        <Header />
        <Component />
      </div>
    </UserContextProvider>
  );
}

App.getInitialProps = async (context: AppContext) => {
  const { data } = await isoAxios(context.ctx.req).get(
    '/api/users/currentUser',
  );

  return { pageProps: data };
};
