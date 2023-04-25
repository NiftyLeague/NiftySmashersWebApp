import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Card, Typography, Space } from '@supabase/ui';
import Auth from '@/lib/playfab/components/Auth';
import BackButton from '@/components/BackButton';
import useProviders from '@/hooks/useProviders';

const Login = () => {
  const router = useRouter();
  const { isLoggedIn } = Auth.useUser();
  const providers = useProviders();

  useEffect(() => {
    if (isLoggedIn) router.push('/profile');
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
                providers={providers}
                view="sign_in"
                socialLayout="horizontal"
                socialButtonSize="xlarge"
                redirectTo="/profile"
              />
            </Space>
          </Card>
        )}
      </div>
    </>
  );
};

export default Login;
