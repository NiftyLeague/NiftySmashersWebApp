import {
  Auth,
  Card,
  Typography,
  Space,
  Button,
  IconLogOut,
  IconLock,
} from '@supabase/ui';
import { supabase } from '@/utils/initSupabase';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Logout = ({ user }: any) => {
  const router = useRouter();
  const [authView, setAuthView] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '420px',
        height: '100vh',
        margin: 'auto',
      }}
    >
      {user && (
        <Card style={{ margin: 'auto', textAlign: 'center' }}>
          <Space direction="vertical" size={6}>
            {authView === 'update_password' ? (
              <Auth.UpdatePassword supabaseClient={supabase} />
            ) : (
              <>
                <Typography.Text>You&apos;re signed in</Typography.Text>
                <Typography.Text strong>Email: {user.email}</Typography.Text>
                <div
                  style={{
                    display: 'flex',
                    width: 275,
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    icon={<IconLock />}
                    type="outline"
                    onClick={() => setAuthView('update_password')}
                  >
                    Update Password
                  </Button>
                  <Button
                    icon={<IconLogOut />}
                    type="outline"
                    onClick={() => {
                      supabase.auth.signOut();
                      setTimeout(() => router.push('/login'), 1000);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </>
            )}
          </Space>
        </Card>
      )}
    </div>
  );
};

export async function getServerSideProps({ req }: { req: Request }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } };
  }

  // If there is a user, return it.
  return { props: { user } };
}

export default Logout;
