import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { supabase } from '@/utils/initSupabase';
import Auth from '@/components/Auth';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // useEffect(() => {
  //   const handleDeepLinking = async (): Promise<void> => {
  //     const params = Object.fromEntries(
  //       new URLSearchParams(window.location.hash.replace('#', '?'))
  //     );
  //     console.log('params', params);
  //     if (!params.refreshToken || !params.refreshToken) return;
  //     await supabase.auth.setSession({
  //       access_token: params.accessToken,
  //       refresh_token: params.refreshToken,
  //     });
  //   };
  //   if (typeof window !== 'undefined' && window.location.hash) {
  //     void handleDeepLinking();
  //   }
  // }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('event', event);
        console.log('session', session);
        if (event === 'PASSWORD_RECOVERY')
          setTimeout(() => router.push('/logout'), 1000);
        if (event === 'USER_UPDATED')
          setTimeout(() => router.push('/login'), 1000);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }).then(res => res.json());
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  return (
    <main className={'dark'}>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
    </main>
  );
}
