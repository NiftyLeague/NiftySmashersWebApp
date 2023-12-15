import { Unity } from 'react-unity-webgl';
import { Button, IconMaximize } from '@supabase/ui';
import useUnityPreConfig from '@/hooks/useUnityPreConfig';
import useUnityEventHandlers from '@/hooks/useUnityEventHandlers';
import useUnitySafeClose from '@/hooks/useUnitySafeClose';
// import { Auth } from '@/lib/playfab/components';
import Preloader from './Preloader';
import styles from '@/styles/modal.module.css';

const Game = ({ closeGame }: { closeGame: () => void }) => {
  //   const { account, publisherData } = Auth.useUserContext();
  const address = '0x0';
  const authToken = '';

  const {
    addEventListener,
    isLoaded,
    loadingProgression,
    removeEventListener,
    requestFullscreen,
    unityProvider,
    unload,
  } = useUnityPreConfig();

  useUnityEventHandlers({
    address,
    authToken,
    addEventListener,
    removeEventListener,
  });

  useUnitySafeClose({ closeGame, unload });

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
        onClick={() => requestFullscreen(true)}
        style={{ position: 'absolute', top: 5, right: 5 }}
        icon={<IconMaximize />}
        placeholder=""
      />
    </>
  );
};

export default Game;
