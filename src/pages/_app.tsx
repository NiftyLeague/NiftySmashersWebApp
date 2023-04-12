import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { playfab } from '@/utils/initPlayfab';
import Auth from '@/components/Auth';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={'dark'}>
      <Auth.UserContextProvider playFabClient={playfab}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
    </main>
  );
}
