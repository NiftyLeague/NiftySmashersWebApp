import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PlayFabClient } from 'playfab-sdk';
import {
  clearCustomID,
  getRandomKey,
  getUserAuth,
  PersistCustomID,
} from '@/utils/authStorage';

type User = PlayFabClientModels.GetAccountInfoResult;
type Session = string;

export interface AuthSession {
  user: User | null;
  session: Session | null;
  GetPlayerCombinedInfo: () => PlayFabClientModels.GetPlayerCombinedInfoResult | null;
}

const UserContext = createContext<AuthSession>({
  user: null,
  session: null,
  GetPlayerCombinedInfo: () => null,
});

export interface Props {
  playFabClient: typeof PlayFabClient;
  [propName: string]: any;
}

const GetAccountInfoAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    playFabClient.GetAccountInfo({}, function (error, result) {
      if (error) {
        console.error('GetAccountInfo Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('GetAccountInfo:', result.data);
        resolve(result.data);
      }
    });
  });
};

const GenerateCustomIDAsync = async (
  playFabClient: typeof PlayFabClient
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const CustomId = getRandomKey();
    const request = { CustomId, ForceLink: false };
    playFabClient.LinkCustomID(request, (error, result) => {
      if (error) {
        console.error('LinkCustomID Error:', error.errorMessage);
        reject(error);
      } else {
        console.log('CustomID Link Success');
        resolve(CustomId);
      }
    });
  });
};

export const UserContextProvider = (props: Props) => {
  const { playFabClient } = props;
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = playFabClient.IsClientLoggedIn();
  const { customId, persistLogin } = getUserAuth();

  useEffect(() => {
    async function handleAccountInfo() {
      // Call GetAccountInfo API to retrieve user details
      const user = await GetAccountInfoAsync(playFabClient);
      if (user) {
        setUser(user);
        let anonymousId = user.AccountInfo?.CustomIdInfo?.CustomId;
        // Generate & link a CustomID if not available
        if (!anonymousId) {
          anonymousId = await GenerateCustomIDAsync(playFabClient);
          const user = await GetAccountInfoAsync(playFabClient);
          if (user) setUser(user);
        }
        // Store CustomID to persist login
        if (anonymousId && persistLogin) PersistCustomID(anonymousId);
      }
    }
    async function handleAnonLogin(CustomId: string) {
      const request = { CreateAccount: false, CustomId };
      playFabClient.LoginWithCustomID(request, (error, result) => {
        if (error) {
          console.error('LoginWithCustomID Error:', error.errorMessage);
          if (error.code === 404) clearCustomID();
          setSession(null);
          setUser(null);
        } else {
          console.log('LoginWithCustomID Link Success', result.data);
          GetAccountInfoAsync(playFabClient);
        }
      });
    }

    console.log('playFabClient.IsClientLoggedIn', isLoggedIn);
    if (isLoggedIn) {
      void handleAccountInfo();
    } else if (customId && persistLogin) {
      // console.log('logged in', playFabClient.IsClientLoggedIn());
      void handleAnonLogin(customId);
    } else {
      setSession(null);
      setUser(null);
    }
  }, [playFabClient, isLoggedIn, persistLogin, customId]);

  const GetPlayerCombinedInfo =
    useCallback((): PlayFabClientModels.GetPlayerCombinedInfoResult | null => {
      let playerInfo = null;
      const request = {
        InfoRequestParameters: {
          GetUserAccountInfo: true,
          GetUserInventory: true,
          GetUserVirtualCurrency: true,
          GetUserReadOnlyData: true,
          GetUserTitleData: true,
          GetUserPublisherData: true,
        },
      };
      playFabClient.GetPlayerCombinedInfo(
        request as unknown as PlayFabClientModels.GetPlayerCombinedInfoRequest,
        function (error, result) {
          if (error) {
            console.error('GetPlayerCombinedInfo Error:', error.errorMessage);
          } else {
            console.log('GetPlayerCombinedInfo:', result.data);
            playerInfo = result.data;
          }
        }
      );
      return playerInfo;
    }, [playFabClient]);

  const value = {
    session,
    user,
    GetPlayerCombinedInfo,
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
