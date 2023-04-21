import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Button, IconLink2, Input } from '@supabase/ui';
import { LinkWallet, UnlinkWallet, signMessage } from '@/utils/wallet';
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
          enqueueSnackbar(`Unknown error: ${e}`, { variant: 'error' });
        }
      }
    }
  };

  const handleUnLinkWallet = async () => {
    setError(undefined);
    console.log('address', address);
    if (address) {
      try {
        const [chain, wallet] = address.split(':');
        await UnlinkWallet({ address: wallet, chain });
        await refetchPlayer();
        enqueueSnackbar('Unlink wallet link success!', { variant: 'success' });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else if ((e as { errorMessage: string })?.errorMessage) {
          enqueueSnackbar(`${(e as { errorMessage: string }).errorMessage}`, {
            variant: 'error',
          });
        } else {
          console.error(`Unknown error: ${e}`);
        }
      }
    }
  };

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
              <Button danger key="remove" onClick={handleUnLinkWallet}>
                Remove
              </Button>,
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
