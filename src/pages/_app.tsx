import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { playfab } from '@/lib/playfab/init';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import Auth from '@/lib/playfab/components/Auth';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={'dark'}>
      <SessionProvider session={pageProps.session}>
        <Auth.UserContextProvider playFabClient={playfab.PlayFabClient}>
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Component {...pageProps} />
          </SnackbarProvider>
        </Auth.UserContextProvider>
      </SessionProvider>
    </main>
  );
}
