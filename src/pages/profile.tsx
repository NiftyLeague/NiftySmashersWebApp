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

export default function Profile() {
  const router = useRouter();
  const { account, isLoggedIn, playFabId: uid } = Auth.useUser();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Profiles['email']>(null);
  const [username, setUsername] = useState<Profiles['username']>(null);
  const [full_name, setFullName] = useState<Profiles['full_name']>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  useEffect(() => {
    console.log('Profile.account:', account);
    if (account && !isEmpty(account)) {
      setEmail(account.PrivateInfo?.Email ?? null);
      // setUsername(user_metadata.username);
      // setFullName(user_metadata.full_name);
      // setAvatarUrl(user_metadata.avatar_url);
      setLoading(false);
    }
  }, [account]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: Profiles['username'];
    avatar_url: Profiles['avatar_url'];
  }) {
    try {
      setLoading(true);
      // if (!user) throw new Error('No user');

      // const updates = {
      //   id: user.id,
      //   username,
      //   avatar_url,
      //   updated_at: new Date().toISOString(),
      // };

      // let { error } = await supabase.from('profiles').upsert(updates);
      // if (error) throw error;
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
                      updateProfile({ username, avatar_url: url });
                    }}
                  />
                ) : null}
                <div>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="text" value={email || ''} disabled />
                </div>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={full_name || ''}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <button
                    className={cn(styles.button, styles.primary, 'block')}
                    disabled={loading}
                    onClick={() => updateProfile({ username, avatar_url })}
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
                    onClick={() => router.push('/update-password')}
                  >
                    <IconLock />
                    Update Password
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
