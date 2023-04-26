import { useEffect, useState } from 'react';
import { Button, Space } from '@supabase/ui';
import type { Provider } from '@/lib/playfab/types';
import { Auth, SocialIcons, buttonStyles } from '@/lib/playfab/components';
import { useSession, signIn, getSession } from 'next-auth/react';

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
  // const { data: session } = useSession();
  // console.log('LinkedProviders.player', player);
  // console.log('LinkedProviders.session', session);
  const verticalSocialLayout = socialLayout === 'vertical' ? true : false;
  const [loading, setLoading] = useState(false);
  const [linkedProviders, setLinkedProviders] = useState<Provider[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (player.profile?.LinkedAccounts) {
      const providers = player.profile?.LinkedAccounts.map(p =>
        p.Platform?.toLowerCase()
      );
      setLinkedProviders(providers as Provider[]);
    }
  }, [player.profile]);

  const handleLinkProvider = async (provider: Provider) => {
    setLoading(true);
    await signIn(provider);
    // const session = await getSession();
    // const { error, result } = await linkProvider(provider);
    // console.log('handleLinkProvider.session', session);
    // @ts-ignore
    if (error) setError(error?.message || error?.errorMessage);
    setLoading(false);
  };

  return providers && providers.length > 0 ? (
    <Space size={2} direction={socialLayout}>
      {providers.map(provider => {
        // @ts-ignore
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
                linkedProviders.includes(provider) ? buttonStyles[provider] : {}
              }
              icon={AuthIcon ? <AuthIcon /> : ''}
              loading={loading}
              onClick={() => handleLinkProvider(provider)}
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
