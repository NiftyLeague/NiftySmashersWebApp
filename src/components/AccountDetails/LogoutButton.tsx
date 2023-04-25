import { useRouter } from 'next/router';
import cn from 'classnames';
import { IconLogOut } from '@supabase/ui';
import { logout } from '@/lib/playfab/api';

import styles from '@/styles/profile.module.css';

export default function LogoutButton({ loading = false }) {
  const router = useRouter();
  return (
    <div>
      <button
        className={cn(styles.button, 'block')}
        style={{ marginBottom: 0 }}
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
  );
}
