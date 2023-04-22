import {
  useCallback,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Button, IconMaximize } from '@supabase/ui';
import Auth from '@/components/Auth';
import Preloader from './Preloader';
import styles from '@/styles/modal.module.css';

const smashersBaseUrl = process.env
  .NEXT_PUBLIC_UNITY_SMASHERS_BASE_URL as string;
const smashersBuildVersion = process.env
  .NEXT_PUBLIC_UNITY_SMASHERS_BASE_VERSION as string;

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false';

const loaderUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.loader.js`;
const dataUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.data${
  useCompressed ? '.br' : ''
}`;
const frameworkUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.framework.js${
  useCompressed ? '.br' : ''
}`;
const codeUrl = `${smashersBaseUrl}/Build/${smashersBuildVersion}.wasm${
  useCompressed ? '.br' : ''
}`;

const Game = ({
  setCanUnmount,
  visible,
}: {
  setCanUnmount: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}) => {
  //   const { account, publisherData } = Auth.useUser();
  const address = '0x0';
  const authToken = '';
  const authMsg = `true,${address || '0x0'},Vitalik,${authToken}`;
  const authCallback = useRef<null | ((authMsg: string) => void)>();

  const {
    addEventListener,
    isLoaded,
    loadingProgression,
    removeEventListener,
    requestFullscreen,
    sendMessage,
    unityProvider,
    unload,
    UNSAFE__unityInstance,
  } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
    streamingAssetsUrl: `${smashersBaseUrl}/StreamingAssets`,
    companyName: 'NiftyLeague',
    productName: 'NiftySmashers',
    productVersion: smashersBuildVersion,
  });

  const handleLeavePage = useCallback(async () => {
    await unload();
    // Ready to navigate to another page.
    setCanUnmount(true);
  }, [unload, setCanUnmount]);

  useEffect(() => {
    if (visible && UNSAFE__unityInstance) {
      (window as any).unityInstance = UNSAFE__unityInstance;
      (window as any).unityInstance.SendMessage = sendMessage;
    } else {
      handleLeavePage();
      (window as any).unityInstance = null;
    }
  }, [handleLeavePage, sendMessage, UNSAFE__unityInstance, visible]);

  useEffect(() => {
    if (address.length && authCallback.current) {
      authCallback.current(authMsg);
    }
  }, [address, authMsg]);

  const startAuthentication = useCallback(
    (e: CustomEvent<{ callback: (auth: string) => void }>) => {
      // eslint-disable-next-line no-console
      console.log('Authenticating:', authMsg);
      e.detail.callback(authMsg);
      authCallback.current = e.detail.callback;
    },
    [authMsg]
  );

  const getConfiguration = useCallback(
    (e: CustomEvent<{ callback: (network: string) => void }>) => {
      const networkName =
        process.env.NODE_ENV === 'production' ? 'mainnet' : 'goerli';
      const version = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION;
      // eslint-disable-next-line no-console
      console.log('getConfiguration', `${networkName},${version ?? ''}`);
      setTimeout(
        () => e.detail.callback(`${networkName},${version ?? ''}`),
        1000
      );
    },
    []
  );

  useEffect(() => {
    addEventListener('StartAuthentication', startAuthentication);
    addEventListener('GetConfiguration', getConfiguration);
    return function cleanup() {
      removeEventListener('StartAuthentication', startAuthentication);
      removeEventListener('GetConfiguration', getConfiguration);
    };
  }, [
    addEventListener,
    getConfiguration,
    removeEventListener,
    startAuthentication,
  ]);

  const handleOnClickFullscreen = () => requestFullscreen(true);

  return (
    <>
      <Preloader ready={isLoaded} progress={loadingProgression} />
      <Unity
        key={authToken}
        unityProvider={unityProvider}
        className={styles.modal_game_canvas}
        style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
      />
      <Button
        type="outline"
        size="large"
        onClick={handleOnClickFullscreen}
        style={{ position: 'absolute', top: 5, right: 5 }}
        icon={<IconMaximize />}
      />
    </>
  );
};

export default Game;
