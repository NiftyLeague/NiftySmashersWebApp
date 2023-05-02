import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button, IconLoader, IconSave, Input } from '@supabase/ui';
import { useSnackbar } from 'notistack';
import { fetchJson, parseLinkedWalletResult } from '@/lib/playfab/utils';
import useProviders from '@/hooks/useProviders';
import useFlags from '@/hooks/useFlags';
import { Auth } from '@/lib/playfab/components';
import Avatar from '@/components/Avatar';
import LinkedProviders from './LinkedProviders';
import LinkWalletInput from './LinkWalletInput';
import LogoutButton from './LogoutButton';

import styles from '@/styles/profile.module.css';

type Profile = {
  avatar_url?: string;
  displayName?: string;
  email?: string;
};

export default function AccountDetails() {
  const user = Auth.useUserContext();
  const { account, isLoggedIn, playFabId: uid, profile, publisherData } = user;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Profile['email']>();
  const [displayName, setDisplayName] = useState<Profile['displayName']>();
  const [linkedWallets, setLinkedWallets] = useState<string[]>([]);
  const [avatar_url, setAvatarUrl] = useState<Profile['avatar_url']>();
  const providers = useProviders();
  const flags = useFlags();

  useEffect(() => {
    if (account && !isEmpty(account)) {
      setEmail(account.PrivateInfo?.Email);
      setAvatarUrl(profile?.AvatarUrl);
      setDisplayName(publisherData?.DisplayName?.Value);
      setLinkedWallets(parseLinkedWalletResult(publisherData) ?? []);
      setLoading(false);
    }
  }, [account, profile, publisherData]);

  async function updateProfile({ avatar_url, displayName, email }: Profile) {
    try {
      setLoading(true);
      if (!account || !profile) throw new Error('No user');
      const body = {} as Profile;

      // Update Account Display Name
      if (displayName && displayName !== publisherData?.DisplayName?.Value)
        body.displayName = displayName;
      // Update Profile Contact Email
      if (email && email !== account.PrivateInfo?.Email) body.email = email;
      // Update Profile Avatar
      if (avatar_url && avatar_url !== profile.AvatarUrl)
        body.avatar_url = avatar_url;

      await fetchJson('/api/playfab/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      enqueueSnackbar('Profile updated!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating the data.', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return isLoggedIn ? (
    <>
      {uid && flags.enableAvatars ? (
        <Avatar
          uid={uid}
          url={avatar_url}
          size={150}
          onUpload={url => {
            setAvatarUrl(url);
            updateProfile({ avatar_url: url });
          }}
        />
      ) : null}
      <div>
        <label htmlFor="email" style={{ marginTop: 0 }}>
          Email
        </label>
        <input id="email" type="text" value={email || ''} disabled />
      </div>

      <div>
        <label htmlFor="displayName">Display Name</label>
        <Input
          type="text"
          value={displayName || ''}
          onChange={e => setDisplayName(e.target.value)}
          actions={[
            <Button
              key="save"
              className={styles.button_primary}
              icon={loading ? <IconLoader /> : <IconSave />}
              onClick={() => updateProfile({ displayName })}
            >
              {loading ? 'Loading ...' : 'Update'}
            </Button>,
          ]}
        />
      </div>
      {flags.enableLinkWallet && (
        <div>
          <label htmlFor="wallets">Linked Wallet(s)</label>
          <LinkWalletInput index={1} address={linkedWallets[0] || ''} />
          {Boolean(linkedWallets[0] || '') && (
            <LinkWalletInput index={2} address={linkedWallets[1] || ''} />
          )}
          {Boolean(linkedWallets[1]) && (
            <LinkWalletInput index={3} address={linkedWallets[2] || ''} />
          )}
        </div>
      )}

      {flags.enableLinkProviders && (
        <div>
          <label htmlFor="providerss">Linked Provider(s)</label>
          <LinkedProviders providers={providers} />
        </div>
      )}

      <hr className={styles.hr} />

      <LogoutButton loading={loading} />
    </>
  ) : null;
}
