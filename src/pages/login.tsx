import Image from 'next/image';
import { Card, Typography, Space } from '@supabase/ui';
import { supabase } from '@/utils/initSupabase';
import BackButton from '@/components/BackButton';
import Auth from '@/components/Auth';

const Login = () => {
  const { user } = Auth.useUser();
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
        {!user && (
          <Card style={{ margin: 'auto' }}>
            <Space direction="vertical" size={8}>
              <div>
                <Image
                  src="/logo/white.png"
                  alt="Company Logo"
                  width={50}
                  height={50}
                />
                <Typography.Title level={3} style={{ marginTop: 16 }}>
                  Welcome to Nifty League
                </Typography.Title>
              </div>
              <Auth
                supabaseClient={supabase}
                providers={['google', 'discord', 'facebook']}
                view="sign_in"
                socialLayout="horizontal"
                socialButtonSize="xlarge"
              />
            </Space>
          </Card>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req }: { req: Request }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } };
  }

  // If there is a no user, return it.
  return { props: { user } };
}

export default Login;
