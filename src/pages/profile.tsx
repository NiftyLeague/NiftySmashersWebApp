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
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/initSupabase';
import Avatar from '@/components/Avatar';
import BackButton from '@/components/BackButton';

import { Database } from '@/utils/database.types';
type Profiles = Database['public']['Tables']['profiles']['Row'];

import styles from '@/styles/profile.module.css';

export default function Profile({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Profiles['email']>(null);
  const [username, setUsername] = useState<Profiles['username']>(null);
  const [full_name, setFullName] = useState<Profiles['full_name']>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null);

  useEffect(() => {
    console.log('Profile.user:', user);
    if (user?.id && !isEmpty(user?.user_metadata)) {
      const { user_metadata } = user;
      setEmail(user_metadata.email);
      setUsername(user_metadata.username);
      setFullName(user_metadata.full_name);
      setAvatarUrl(user_metadata.avatar_url);
      setLoading(false);
    }
  }, [user]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: Profiles['username'];
    avatar_url: Profiles['avatar_url'];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
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
              <Avatar
                uid={user.id}
                url={avatar_url}
                size={150}
                onUpload={url => {
                  setAvatarUrl(url);
                  updateProfile({ username, avatar_url: url });
                }}
              />
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={email || ''} disabled />
              </div>
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={full_name || ''} disabled />
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
                    supabase.auth.signOut();
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
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: { req: Request }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    // If no user, redirect to login.
    return { props: {}, redirect: { destination: '/login', permanent: false } };
  }

  // If there is a user, return it.
  return { props: { user } };
}
