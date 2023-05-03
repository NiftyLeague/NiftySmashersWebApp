import { playfab } from '@/lib/playfab/init';
import {
  getRandomKey,
  isEthereumSignatureValid,
  parseLinkedWalletResult,
} from '@/lib/playfab/utils';
import type {
  AccountResult,
  LinkAppleResult,
  LinkFacebookResult,
  LinkGoogleResult,
  LinkProviderResult,
  LinkTwitchResult,
  LoginResult,
  PlayerResult,
  Provider,
  PublisherDataResult,
  RegisterUserResult,
  UserData,
} from '@/lib/playfab/types';

const { PlayFabClient, PlayFabCloudScript } = playfab;

// Client API: https://github.com/PlayFab/NodeSDK/blob/master/PlayFabSdk/Scripts/PlayFab/PlayFabClient.js
// CloudScript API: https://github.com/PlayFab/NodeSDK/blob/master/PlayFabSdk/Scripts/PlayFab/PlayFabCloudScript.js

/*************************************** Login / Sign Up **********************************************/

export const RegisterPlayFabUser = async (params: {
  Email: string;
  Password: string;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<RegisterUserResult>> => {
  const request = {
    ...params,
    Username: getRandomKey(20),
    RequireBothUsernameAndEmail: true,
  };
  return new Promise((resolve, reject) => {
    PlayFabClient.RegisterPlayFabUser(request, (error, result) => {
      if (error) {
        console.error('RegisterPlayFabUser Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const LoginWithEmailAddress = async (params: {
  Email: string;
  Password: string;
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<LoginResult>> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.LoginWithEmailAddress({ ...params }, (error, result) => {
      if (error) {
        console.error('LoginWithEmailAddress Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const LoginWithCustomID = async (params: {
  CustomId: string;
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams;
}): Promise<PlayFabModule.IPlayFabSuccessContainer<LoginResult>> => {
  return new Promise((resolve, reject) => {
    const request = { ...params, CreateAccount: false };
    PlayFabClient.LoginWithCustomID(request, (error, result) => {
      if (error) {
        console.error('LoginWithCustomID Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const GenerateCustomIDAsync = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const CustomId = getRandomKey(100);
    const request = { CustomId, ForceLink: false };
    PlayFabClient.LinkCustomID(request, (error, result) => {
      if (error) {
        console.error('LinkCustomID Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(CustomId);
      }
    });
  });
};

export const SendAccountRecoveryEmail = async (params: {
  Email: string;
}): Promise<
  PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.SendAccountRecoveryEmailResult>
> => {
  return new Promise((resolve, reject) => {
    const request = { TitleId: PlayFabClient.settings.titleId, ...params };
    PlayFabClient.SendAccountRecoveryEmail(request, (error, result) => {
      if (error) {
        console.error('SendAccountRecoveryEmail Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export function logoutPlayFabUser() {
  PlayFabClient.ForgetAllCredentials();
}

/*************************************** Linked Providers **********************************************/

async function LinkGoogleAccount(
  AccessToken: string
): Promise<LinkGoogleResult | null> {
  return new Promise((resolve, reject) => {
    PlayFabClient.LinkGoogleAccount(
      // @ts-expect-error PlayFab type incorrectly expects ServerAuthCode
      { ForceLink: true, AccessToken },
      function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

async function LinkAppleAccount(
  IdentityToken: string
): Promise<LinkAppleResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.LinkApple(
      { ForceLink: true, IdentityToken },
      function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

async function LinkFacebookAccount(
  AccessToken: string
): Promise<LinkFacebookResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.LinkFacebookAccount(
      { ForceLink: true, AccessToken },
      function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

async function LinkTwitchAccount(
  AccessToken: string
): Promise<LinkTwitchResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.LinkTwitch(
      { ForceLink: true, AccessToken },
      function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

export const LinkProvider = async (
  provider: Provider,
  accesssToken: string
): Promise<{ error?: unknown; result?: LinkProviderResult }> => {
  try {
    let result: LinkProviderResult = null;
    switch (provider) {
      case 'google':
        result = await LinkGoogleAccount(accesssToken);
        break;
      case 'apple':
        result = await LinkAppleAccount(accesssToken);
        break;
      case 'facebook':
        result = await LinkFacebookAccount(accesssToken);
        break;
      case 'twitch':
        result = await LinkTwitchAccount(accesssToken);
        break;
      default:
        break;
    }
    return { result };
  } catch (error) {
    return { error };
  }
};

/*************************************** GET Account Info **********************************************/

export const GetAccountInfoAsync = async (): Promise<AccountResult | null> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.GetAccountInfo({}, (error, result) => {
      if (error) {
        console.error('GetAccountInfo Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
};

const ProfileConstraints = {
  ShowAvatarUrl: true,
  // ShowBannedUntil: true,
  // ShowCampaignAttributions: true,
  // ShowContactEmailAddresses: true,
  // ShowCreated: true,
  ShowDisplayName: true,
  // ShowExperimentVariants: true,
  // ShowLastLogin: true,
  ShowLinkedAccounts: true,
  // ShowLocations: true,
  // ShowMemberships: true,
  // ShowOrigination: true,
  // ShowPushNotificationRegistrations: true,
  // ShowStatistics: true,
  // ShowTags: true,
  // ShowTotalValueToDateInUsd: true,
  // ShowValuesToDate: true,
} as PlayFabClientModels.PlayerProfileViewConstraints;

const InfoRequestParameters = {
  GetUserAccountInfo: true,
  GetPlayerProfile: true,
  ProfileConstraints,
  GetPlayerStatistics: true,
  // PlayerStatisticNames: [],
  GetUserInventory: true,
  GetUserVirtualCurrency: true,
  GetCharacterInventories: false,
  GetCharacterList: false,
  GetTitleData: false,
  GetUserData: false,
  // UserDataKeys: ['DisplayName', 'LinkedWallets'],
  GetUserReadOnlyData: false,
  // UserReadOnlyDataKeys: []
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

export const GetPlayerCombinedInfo = async (): Promise<PlayerResult | null> => {
  return new Promise((resolve, reject) => {
    const request = { InfoRequestParameters };
    PlayFabClient.GetPlayerCombinedInfo(request, (error, result) => {
      if (error) {
        console.error('GetPlayerCombinedInfo Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
};

export async function GetUserPublisherReadOnlyData(
  Keys: string[]
): Promise<PublisherDataResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.GetUserPublisherReadOnlyData({ Keys }, (error, result) => {
      if (error) {
        console.error(
          'GetUserPublisherReadOnlyData Error:',
          error.errorMessage
        );
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
}

export async function GetLinkedWallets(): Promise<PublisherDataResult> {
  return GetUserPublisherReadOnlyData(['LinkedWallets']);
}

export const GetUserPublisherData = async (): Promise<UserData> => {
  const { Data: PublisherData } = await GetUserPublisherReadOnlyData([
    'LinkedWallets',
    'DisplayName',
  ]);
  return { ...PublisherData };
};

/*************************************** UPDATE Account Info **********************************************/

export async function AddOrUpdateContactEmail(
  EmailAddress: string
): Promise<PlayFabClientModels.AddOrUpdateContactEmailResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.AddOrUpdateContactEmail({ EmailAddress }, (error, result) => {
      if (error) {
        console.error('AddOrUpdateContactEmail Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export async function UpdateAvatarUrl(
  ImageUrl: string
): Promise<PlayFabClientModels.EmptyResponse> {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateAvatarUrl({ ImageUrl }, (error, result) => {
      if (error) {
        console.error('UpdateAvatarUrl Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export async function UpdateUserPublisherData(
  request: PlayFabClientModels.UpdateUserDataRequest
): Promise<PlayFabClientModels.UpdateUserDataResult> {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateUserPublisherData(request, (error, result) => {
      if (error) {
        console.error('UpdateUserPublisherData Error:', error.errorMessage);
        reject(error);
      } else {
        resolve(result.data);
      }
    });
  });
}

/*************************************** PlayFabCloudScript **********************************************/

async function ExecuteFunction(
  FunctionName: string,
  FunctionParameter: any
): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  return new Promise((resolve, reject) => {
    PlayFabCloudScript.ExecuteFunction(
      { FunctionName, FunctionParameter },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

export async function ChangeDisplayName(
  DisplayName: string
): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  const FunctionName = 'Accounts_ChangeDisplayName';
  const FunctionParameter = { DisplayName };
  return ExecuteFunction(FunctionName, FunctionParameter);
}

type LinkWalletParams = {
  chain?: string;
  address: string;
  signature: string;
  nonce: string;
};

export async function LinkWallet({
  chain = 'ethereum',
  address,
  signature,
  nonce,
}: LinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  let linkedWallets: string[] = [];
  const { Data } = await GetLinkedWallets();
  if (Data) linkedWallets = parseLinkedWalletResult(Data);
  if (chain != 'ethereum')
    throw new Error('Only Ethereum wallets are supported at this time');

  if (!isEthereumSignatureValid(address, signature, nonce))
    throw new Error('Failed to validate signature');

  const walletEntry = `${chain}:${address}`.toLowerCase();
  if (linkedWallets.includes(walletEntry))
    throw new Error(
      `${address.substring(0, 6)}... address is already linked to this account`
    );

  const FunctionName = 'Accounts_LinkWallet';
  const FunctionParameter = {
    Chain: chain,
    Address: address.toLowerCase(),
    Signature: signature,
    Nonce: nonce,
  };

  return ExecuteFunction(FunctionName, FunctionParameter);
}

type UnlinkWalletParams = { chain?: string; address: string };

export async function UnlinkWallet({
  chain = 'ethereum',
  address,
}: UnlinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  let linkedWallets: string[] = [];
  const { Data } = await GetLinkedWallets();
  if (Data) linkedWallets = parseLinkedWalletResult(Data);
  if (chain != 'ethereum')
    throw new Error('Only Ethereum wallets are supported at this time');

  const walletEntry = `${chain}:${address}`.toLowerCase();
  if (!linkedWallets.includes(walletEntry))
    throw new Error(
      `${address.substring(0, 6)}... address is not linked to this account`
    );

  const FunctionName = 'Accounts_UnlinkWallet';
  const FunctionParameter = {
    Chain: chain,
    Address: address.toLowerCase(),
  };

  return ExecuteFunction(FunctionName, FunctionParameter);
}
