import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authStorage } from '@/lib/playfab/utils';
import {
  AuthSession,
  PlayerResult,
  PlayFabClient,
  PublisherData,
} from '@/lib/playfab/types';
import {
  GenerateCustomIDAsync,
  GetAccountInfoAsync,
  GetPlayerCombinedInfoAsync,
  GetUserPublisherDataAsync,
  LoginWithCustomIDAsync,
} from '@/lib/playfab/api';

export const UserContext = createContext<AuthSession>({
  account: undefined,
  currencies: undefined,
  inventory: [],
  isLoggedIn: false,
  playFabId: undefined,
  profile: undefined,
  publisherData: undefined,
  stats: [],
  refetchPlayer: () => new Promise(() => {}),
});

export interface Props {
  playFabClient: PlayFabClient;
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const { playFabClient } = props;
  const [init, setInit] = useState(false);
  const [player, setPlayer] = useState<PlayerResult | null>(null);
  const [publisherData, setPublisherData] = useState<PublisherData | null>(
    null
  );
  const isLoggedIn = playFabClient?.IsClientLoggedIn();
  const { customId, persistLogin } = authStorage.getUserAuth();

  const handlePlayerCombinedInfo = useCallback(async () => {
    const player = await GetPlayerCombinedInfoAsync();
    if (player) {
      const publisherData = await GetUserPublisherDataAsync();
      setPublisherData(publisherData);
      setPlayer(player);
      setInit(true);
    }
  }, []);

  const handleAccountInfo = useCallback(async () => {
    // Call GetAccountInfo API to retrieve player account details
    const account = await GetAccountInfoAsync();
    if (account) {
      let anonymousId = account.AccountInfo?.CustomIdInfo?.CustomId;
      // Generate & link a CustomID if not available
      if (!anonymousId) anonymousId = await GenerateCustomIDAsync();
      // Store CustomID to persist login
      if (anonymousId && persistLogin) authStorage.PersistCustomID(anonymousId);
      void handlePlayerCombinedInfo();
    }
  }, [persistLogin, handlePlayerCombinedInfo]);

  const handleAnonLogin = useCallback(
    async (CustomId: string) => {
      // Login player with stored CustomID
      if (!init) {
        const res = await LoginWithCustomIDAsync({ CustomId });
        if (res.error) {
          switch (res.code) {
            case 400: // AccountDeleted
            case 404: // AccountNotFound
              authStorage.clearCustomID();
              break;
            default:
              break;
          }
          setPlayer(null);
        } else {
          void handlePlayerCombinedInfo();
        }
      }
    },
    [handlePlayerCombinedInfo, init]
  );

  useEffect(() => {
    if (isLoggedIn) {
      void handleAccountInfo();
    } else if (customId && persistLogin) {
      void handleAnonLogin(customId);
    } else {
      setPlayer(null);
    }
  }, [customId, isLoggedIn, persistLogin, handleAccountInfo, handleAnonLogin]);

  const refetchPlayer = useCallback(
    async () => await handlePlayerCombinedInfo(),
    [handlePlayerCombinedInfo]
  );
  const { InfoResultPayload, PlayFabId } = player || {};
  const value = useMemo(
    () => ({
      account: InfoResultPayload?.AccountInfo,
      currencies: InfoResultPayload?.UserVirtualCurrency,
      inventory: InfoResultPayload?.UserInventory,
      isLoggedIn: isLoggedIn,
      playFabId: PlayFabId,
      profile: InfoResultPayload?.PlayerProfile,
      stats: InfoResultPayload?.PlayerStatistics,
      publisherData: publisherData ?? undefined,
      refetchPlayer,
    }),
    [InfoResultPayload, isLoggedIn, PlayFabId, publisherData, refetchPlayer]
  );

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
