import { useState, useEffect } from 'react';
import { getProviders } from 'next-auth/react';
import { Provider } from '@supabase/supabase-js';

export default function useProviders(): Provider[] {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const run = async () => {
      const result = await getProviders();
      if (result) {
        const providers = Object.keys(result) as Provider[];
        setProviders(providers);
      }
    };
    // eslint-disable-next-line no-void
    void run();
  }, []);

  return providers;
}
