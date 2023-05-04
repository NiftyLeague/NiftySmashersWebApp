import '@/styles/globals.css';
import '@/styles/animations.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import Auth from '@/lib/playfab/components/Auth';
import { FeatureFlagProvider } from '@/components/FeatureFlagsProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={'dark'}>
      <SessionProvider session={pageProps.session}>
        <Auth.UserContextProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <FeatureFlagProvider>
              <Component {...pageProps} />
            </FeatureFlagProvider>
          </SnackbarProvider>
        </Auth.UserContextProvider>
      </SessionProvider>
    </main>
  );
}
