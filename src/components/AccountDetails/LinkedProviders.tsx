import { useEffect, useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { Button, Space } from '@supabase/ui';
import Auth from '@/components/Auth';
import * as SocialIcons from '@/components/Auth/Icons';
import { useSession, signIn, getSession } from 'next-auth/react';
import { playfab } from '@/utils/initPlayfab';

export interface Props {
  providers: Provider[];
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  socialLayout?: 'horizontal' | 'vertical';
}

type LinkGoogleResult = PlayFabClientModels.LinkGoogleAccountResult;
type LinkFacebookResult = PlayFabClientModels.LinkFacebookAccountResult;
type LinkProviderResult = LinkGoogleResult | LinkFacebookResult | null;

async function linkGoogleAccount(): Promise<LinkGoogleResult | null> {
  const ServerAuthCode = null;
  if (ServerAuthCode) {
    return new Promise((resolve, reject) => {
      playfab.LinkGoogleAccount(
        { ForceLink: true, ServerAuthCode },
        function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result.data);
          }
        }
      );
    });
  }
  return null;
}

async function linkFacebookAccount(): Promise<LinkFacebookResult> {
  return new Promise((resolve, reject) => {
    playfab.GetUserPublisherReadOnlyData(
      { Keys: ['LinkedWallets'] },
      function (error, result) {
        if (error) {
          console.error(
            'GetUserPublisherReadOnlyData Error:',
            error.errorMessage
          );
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

const linkProvider = async (
  provider: Provider
): Promise<{ error?: unknown; result?: LinkProviderResult }> => {
  try {
    let result: LinkProviderResult = null;
    switch (provider) {
      case 'google':
        result = await linkGoogleAccount();
      case 'facebook':
        result = await linkFacebookAccount();
      default:
        break;
    }
    return { result };
  } catch (error) {
    return { error };
  }
};

export default function LinkedProviders({
  providers,
  socialButtonSize = 'medium',
  socialLayout = 'horizontal',
}: Props) {
  const player = Auth.useUser();
  const { data: session } = useSession();
  // console.log('LinkedProviders.player', player);
  console.log('LinkedProviders.session', session);
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
                linkedProviders.includes(provider)
                  ? SocialIcons.buttonStyles[provider]
                  : {}
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
