import { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames';
import {
  Card,
  IconLoader,
  IconLock,
  IconLogOut,
  IconSave,
  Space,
  Typography,
} from '@supabase/ui';
import Auth from '@/components/Auth';
import Avatar from '@/components/Avatar';
import BackButton from '@/components/BackButton';

import { playfab } from '@/utils/initPlayfab';
import { Database } from '@/utils/database.types';
import { clearCustomID } from '@/utils/authStorage';
type Profiles = Database['public']['Tables']['profiles']['Row'];

import styles from '@/styles/profile.module.css';

function logout() {
  playfab.ForgetAllCredentials();
  clearCustomID();
}

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

export default function Profile() {
  const router = useRouter();
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
  // const [linkedWallets, setLinkedWallets] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (account && !isEmpty(account)) {
      setEmail(account.PrivateInfo?.Email ?? null);
      setAvatarUrl(profile?.AvatarUrl ?? null);
      setDisplayName(publisherData?.DisplayName?.Value ?? null);
      // setLinkedWallets(publisherData?.LinkedWallets?.Value ?? null);
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

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          maxWidth: '420px',
          height: '100vh',
          margin: 'auto',
        }}
      >
        {isLoggedIn && (
          <Card className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
              <Image
                src="/logo/white.png"
                alt="Company Logo"
                width={50}
                height={48}
              />
              <Typography.Text type="success">
                You&apos;re signed in
              </Typography.Text>
            </div>
            <Space direction="vertical" size={6} className={styles.userInfo}>
              <div>
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
                  <label htmlFor="email">Email</label>
                  <input id="email" type="text" value={email || ''} disabled />
                </div>
                <div>
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName || ''}
                    onChange={e => setDisplayName(e.target.value)}
                  />
                </div>
                {/* <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={full_name || ''}
                    disabled
                  />
                </div> */}

                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <button
                    className={cn(styles.button, styles.primary, 'block')}
                    disabled={loading}
                    onClick={() => updateProfile({ displayName })}
                  >
                    {loading ? (
                      <>
                        <IconLoader /> Loading ...
                      </>
                    ) : (
                      <>
                        <IconSave /> Save Updates
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    className={cn(styles.button, 'block')}
                    disabled={loading}
                    onClick={() => {
                      logout();
                      setTimeout(() => router.push('/login'), 1000);
                    }}
                  >
                    <IconLogOut />
                    Sign Out
                  </button>
                </div>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </>
  );
}
