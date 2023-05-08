// import { useState, useEffect } from 'react';
// import { getProviders } from 'next-auth/react';
import type { Provider } from '@/lib/playfab/types';

// export default function useProviders(): Provider[] {
//   const [providers, setProviders] = useState<Provider[]>([]);

//   useEffect(() => {
//     const run = async () => {
//       const result = await getProviders();
//       if (result) {
//         const providers = Object.keys(result) as Provider[];
//         setProviders(providers);
//       }
//     };
//     // eslint-disable-next-line no-void
//     void run();
//   }, []);

//   return providers;
// }

// PREFER MANUAL APPROACH BECAUSE ABOVE CODE ADDS EXCESS LOAD TIME

const PROVIDERS: Provider[] = ['google', 'apple', 'facebook', 'twitch'];

export default function useProviders(): Provider[] {
  return PROVIDERS;
}
