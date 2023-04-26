import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Card,
  IconDatabase,
  IconStar,
  IconUser,
  Space,
  Tabs,
  Typography,
} from '@supabase/ui';
import { withSessionSsr } from '@/utils/session';
import AccountDetails from '@/components/AccountDetails';
import Inventory from '@/components/Inventory';
import BackButton from '@/components/BackButton';
import { useUserSession } from '@/lib/playfab/hooks';
import type { User } from '@/lib/playfab/types';

import styles from '@/styles/profile.module.css';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    // logout caught after session
    if (user && !user.isLoggedIn) {
      router.push('/login');
    }
  }, [router, user]);

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          maxWidth: '450px',
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
            <Tabs
              type="underlined"
              size="medium"
              tabBarStyle={{ marginTop: 16 }}
              tabBarGutter={8}
            >
              <Tabs.Panel
                id="account"
                icon={<IconUser />}
                label="Account Details"
              >
                <AccountDetails />
              </Tabs.Panel>
              <Tabs.Panel
                id="inventory"
                icon={<IconDatabase />}
                label="Inventory"
              >
                <Inventory />
              </Tabs.Panel>
              <Tabs.Panel id="stats" icon={<IconStar />} label="Stats">
                <div>coming soon...</div>
              </Tabs.Panel>
            </Tabs>
          </Space>
        </Card>
      </div>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const user = req.session.user;
  // redirect to login if no user found
  if (!user || !user.isLoggedIn) {
    return {
      props: { user: { isLoggedIn: false } as User },
      redirect: { destination: '/login', permanent: false },
    };
  }
  return { props: { user } };
});
