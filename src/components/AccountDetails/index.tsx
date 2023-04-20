import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button, IconLoader, IconSave, Input } from '@supabase/ui';
import Auth from '@/components/Auth';
import Avatar from '@/components/Avatar';
import LinkWalletInput from './LinkWalletInput';
import LogoutButton from './LogoutButton';

import useProviders from '@/hooks/useProviders';
import { parseLinkedWalletResult } from '@/utils/wallet';
import { playfab } from '@/utils/initPlayfab';
import { Database } from '@/utils/database.types';
type Profiles = Database['public']['Tables']['profiles']['Row'];

import styles from '@/styles/profile.module.css';
import LinkedProviders from './LinkedProviders';

async function AddOrUpdateContactEmail(
  EmailAddress: string
): Promise<PlayFabClientModels.AddOrUpdateContactEmailResult> {
  return new Promise((resolve, reject) => {
    playfab.AddOrUpdateContactEmail({ EmailAddress }, (error, result) => {
      if (error) {
        console.error('AddOrUpdateContactEmail Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('AddOrUpdateContactEmail Success');
        resolve(result);
      }
    });
  });
}

async function UpdateAvatarUrl(
  ImageUrl: string
): Promise<PlayFabClientModels.EmptyResponse> {
  return new Promise((resolve, reject) => {
    playfab.UpdateAvatarUrl({ ImageUrl }, (error, result) => {
      if (error) {
        console.error('UpdateAvatarUrl Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('UpdateAvatarUrl Success');
        resolve(result);
      }
    });
  });
}

async function UpdateUserPublisherData(
  request: PlayFabClientModels.UpdateUserDataRequest
): Promise<PlayFabClientModels.UpdateUserDataResult> {
  return new Promise((resolve, reject) => {
    playfab.UpdateUserPublisherData(request, (error, result) => {
      if (error) {
        console.error('UpdateUserPublisherData Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('UpdateUserPublisherData Success');
        resolve(result.data);
      }
    });
  });
}

export default function AccountDetails() {
  const {
    account,
    isLoggedIn,
    playFabId: uid,
    profile,
    publisherData,
  } = Auth.useUser();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Profiles['email']>(null);
  const [displayName, setDisplayName] = useState<Profiles['displayName']>(null);
  const [linkedWallets, setLinkedWallets] = useState<string[]>([]);
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);
  const providers = useProviders();

  useEffect(() => {
    if (account && !isEmpty(account)) {
      setEmail(account.PrivateInfo?.Email ?? null);
      setAvatarUrl(profile?.AvatarUrl ?? null);
      setDisplayName(publisherData?.DisplayName?.Value ?? null);
      setLinkedWallets(parseLinkedWalletResult(publisherData));
      setLoading(false);
    }
  }, [account, profile, publisherData]);

  async function updateProfile({
    email,
    displayName,
    avatar_url,
  }: {
    email?: Profiles['email'];
    displayName?: Profiles['displayName'];
    avatar_url?: Profiles['avatar_url'];
  }) {
    try {
      setLoading(true);
      if (!account || !profile) throw new Error('No user');

      // Update Profile Contact Email
      if (email && email !== account.PrivateInfo?.Email)
        await AddOrUpdateContactEmail(email);

      // Update Account Display Name
      if (displayName && displayName !== publisherData?.DisplayName?.Value) {
        const request = {
          Data: { DisplayName: displayName },
          Permission: 'public',
        };
        await UpdateUserPublisherData(request);
      }

      // Update Profile Avatar
      if (avatar_url && avatar_url !== profile.AvatarUrl)
        await UpdateAvatarUrl(avatar_url);

      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return isLoggedIn ? (
    <>
      {uid ? (
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

      <div>
        <label htmlFor="providerss">Linked Provider(s)</label>
        <LinkedProviders providers={providers} />
      </div>

      <hr className={styles.hr} />

      <LogoutButton loading={loading} />
    </>
  ) : null;
}
