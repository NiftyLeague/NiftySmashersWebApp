import { useCallback, useEffect, useState } from 'react';
import { Button, Space } from '@supabase/ui';
import type { Provider } from '@/lib/playfab/types';
import { fetchJson } from '@/lib/playfab/utils';
import { Auth, SocialIcons, buttonStyles } from '@/lib/playfab/components';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export interface Props {
  providers: Provider[];
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  socialLayout?: 'horizontal' | 'vertical';
}

export default function LinkedProviders({
  providers,
  socialButtonSize = 'medium',
  socialLayout = 'horizontal',
}: Props) {
  const player = Auth.useUserContext();
  const verticalSocialLayout = socialLayout === 'vertical' ? true : false;
  const [linkedProviders, setLinkedProviders] = useState<Provider[]>([]);
  const session = useSession();
  const { asPath } = useRouter();

  // initialize linkedProviders from playfab
  useEffect(() => {
    if (player.profile?.LinkedAccounts) {
      const providers = player.profile?.LinkedAccounts.map(p =>
        p.Platform === 'GooglePlay' ? 'google' : p.Platform?.toLowerCase()
      );
      setLinkedProviders(providers as Provider[]);
    }
  }, [player.profile]);

  const handleLinkProvider = useCallback(
    async (provider: Provider, accessToken: string) => {
      if (!linkedProviders.includes(provider)) {
        try {
          await fetchJson('/api/playfab/user/link-provider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, accessToken }),
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [linkedProviders.length]
  );

  // handle link provider on redirect if NextAuth session authenticated
  useEffect(() => {
    if (asPath.includes('#') && session.status === 'authenticated') {
      const { provider, accessToken } = session.data as unknown as {
        provider: Provider;
        accessToken: string;
      };
      handleLinkProvider(provider, accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, session.status, handleLinkProvider]);

  const handleSignIn = async (provider: Provider) => {
    await signIn(provider, { callbackUrl: `/profile#link-${provider}` });
  };

  return providers && providers.length > 0 ? (
    <Space size={2} direction={socialLayout}>
      {providers.map(provider => {
        const AuthIcon = SocialIcons[provider];
        return (
          <div
            key={provider}
            style={!verticalSocialLayout ? { flexGrow: 1 } : {}}
          >
            <Button
              block
              type="default"
              shadow
              size={socialButtonSize}
              style={
                linkedProviders.includes(provider) || asPath.includes(provider)
                  ? buttonStyles[provider]
                  : {}
              }
              disabled={linkedProviders.includes(provider)}
              icon={AuthIcon ? <AuthIcon /> : ''}
              onClick={() => handleSignIn(provider)}
              className="flex items-center"
            >
              {verticalSocialLayout && 'Sign up with ' + provider}
            </Button>
          </div>
        );
      })}
    </Space>
  ) : null;
}
