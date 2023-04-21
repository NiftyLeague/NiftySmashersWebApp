import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, IconLink2, Input } from '@supabase/ui';
import { LinkWallet, signMessage } from '@/utils/wallet';
import Auth from '@/components/Auth';

export default function LinkWalletInput({
  index,
  address,
}: {
  index: number;
  address?: string;
}) {
  const [error, setError] = useState<string | undefined>();
  const { enqueueSnackbar } = useSnackbar();
  const { refetchPlayer } = Auth.useUser();

  const handleLinkWallet = async () => {
    setError(undefined);
    const result = await signMessage();
    if (result) {
      const { address, nonce, signature } = result;
      try {
        await LinkWallet({ address, signature, nonce });
        await refetchPlayer();
        enqueueSnackbar('Wallet link success!', { variant: 'success' });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          console.error(`Unknown error: ${e}`);
        }
      }
    }
  };

  // const handleUnLinkWallet = async () => {}

  const linked = Boolean(address && address.length > 1);

  return (
    <Input
      key={index}
      copy={linked}
      disabled
      error={error}
      value={address}
      actions={
        linked
          ? [
              // <Button danger key="remove" onClick={handleUnLinkWallet}>
              //   Remove
              // </Button>,
            ]
          : [
              <Button
                type="dashed"
                icon={<IconLink2 />}
                key="connect"
                onClick={handleLinkWallet}
              >
                Connect Wallet
              </Button>,
            ]
      }
    />
  );
}
