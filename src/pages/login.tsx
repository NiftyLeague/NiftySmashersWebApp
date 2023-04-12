import { useEffect } from 'react';
import Image from 'next/image';
import { Card, Typography, Space } from '@supabase/ui';
import { playfab } from '@/utils/initPlayfab';
import BackButton from '@/components/BackButton';
import Auth from '@/components/Auth';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  // const { user } = Auth.useUser();
  const isLoggedIn = playfab.IsClientLoggedIn();

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn, router]);

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
        {!isLoggedIn && (
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
                playFabClient={playfab}
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

export default Login;
