import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Card,
  IconDatabase,
  IconStar,
  IconUser,
  Space,
  Tabs,
  Typography,
} from '@supabase/ui';
import Auth from '@/lib/playfab/components/Auth';
import AccountDetails from '@/components/AccountDetails';
import Inventory from '@/components/Inventory';
import BackButton from '@/components/BackButton';

import styles from '@/styles/profile.module.css';

export default function Profile() {
  const router = useRouter();
  const { isLoggedIn } = Auth.useUser();

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

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
        )}
      </div>
    </>
  );
}
