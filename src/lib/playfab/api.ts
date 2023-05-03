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
  PlayFabError,
  Provider,
  PublisherDataResult,
  RegisterUserResult,
  UserData,
} from '@/lib/playfab/types';
import { InfoRequestParameters } from '@/lib/playfab/constants';

const { PlayFabAdmin, PlayFabClient, PlayFabCloudScript } = playfab;

// Client API: https://github.com/PlayFab/NodeSDK/blob/master/PlayFabSdk/Scripts/PlayFab/PlayFabClient.js
// CloudScript API: https://github.com/PlayFab/NodeSDK/blob/master/PlayFabSdk/Scripts/PlayFab/PlayFabCloudScript.js

async function CallClientAPI<T extends PlayFabModule.IPlayFabResultCommon>(
  functionName: string,
  request: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    (PlayFabClient as any)[functionName](
      request,
      (
        error: PlayFabError,
        result: PlayFabModule.IPlayFabSuccessContainer<T>
      ) => {
        if (error) {
          console.error(`${functionName} Error`, error);
          reject(error);
        } else {
          resolve(result?.data ?? {});
        }
      }
    );
  });
}

/*************************************** Login / Sign Up **********************************************/

export const RegisterPlayFabUser = async (params: {
  Email: string;
  Password: string;
}): Promise<RegisterUserResult> => {
  const request = {
    ...params,
    Username: getRandomKey(20),
    RequireBothUsernameAndEmail: true,
  };
  return CallClientAPI<RegisterUserResult>('RegisterPlayFabUser', request);
};

export const LoginWithEmailAddress = async (params: {
  Email: string;
  Password: string;
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams;
}): Promise<LoginResult> => {
  const request = { ...params };
  return CallClientAPI<LoginResult>('LoginWithEmailAddress', request);
};

export const LoginWithCustomID = async (params: {
  CustomId: string;
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams;
}): Promise<LoginResult> => {
  const request = { ...params, CreateAccount: false };
  return CallClientAPI<LoginResult>('LoginWithCustomID', request);
};

export const GenerateCustomIDAsync = async (): Promise<string> => {
  const CustomId = getRandomKey(100);
  const request = { CustomId, ForceLink: false };
  await CallClientAPI('LinkCustomID', request);
  return CustomId;
};

type AccountRecoveryResult = PlayFabClientModels.SendAccountRecoveryEmailResult;
export const SendAccountRecoveryEmail = async (params: {
  Email: string;
}): Promise<AccountRecoveryResult> => {
  const request = { TitleId: PlayFabClient.settings.titleId, ...params };
  return CallClientAPI<AccountRecoveryResult>(
    'SendAccountRecoveryEmail',
    request
  );
};

export function logoutPlayFabUser() {
  PlayFabClient.ForgetAllCredentials();
}

/*************************************** Linked Providers **********************************************/

async function LinkGoogleAccount(
  AccessToken: string
): Promise<LinkGoogleResult> {
  const request = { ForceLink: true, AccessToken };
  return CallClientAPI<LinkGoogleResult>('LinkGoogleAccount', request);
}

async function LinkAppleAccount(
  IdentityToken: string
): Promise<LinkAppleResult> {
  const request = { ForceLink: true, IdentityToken };
  return CallClientAPI<LinkAppleResult>('LinkApple', request);
}

async function LinkFacebookAccount(
  AccessToken: string
): Promise<LinkFacebookResult> {
  const request = { ForceLink: true, AccessToken };
  return CallClientAPI<LinkFacebookResult>('LinkFacebookAccount', request);
}

async function LinkTwitchAccount(
  AccessToken: string
): Promise<LinkTwitchResult> {
  const request = { ForceLink: true, AccessToken };
  return CallClientAPI<LinkTwitchResult>('LinkTwitch', request);
}

export const LinkProvider = async (
  provider: Provider,
  accesssToken: string
): Promise<{ error?: unknown; data?: LinkProviderResult }> => {
  try {
    let data: LinkProviderResult = null;
    switch (provider) {
      case 'google':
        data = await LinkGoogleAccount(accesssToken);
        break;
      case 'apple':
        data = await LinkAppleAccount(accesssToken);
        break;
      case 'facebook':
        data = await LinkFacebookAccount(accesssToken);
        break;
      case 'twitch':
        data = await LinkTwitchAccount(accesssToken);
        break;
      default:
        break;
    }
    return { data };
  } catch (error) {
    return { error };
  }
};

/*************************************** GET Account Info **********************************************/

export const GetAccountInfoAsync = async (): Promise<AccountResult> => {
  return CallClientAPI<AccountResult>('GetAccountInfo', {});
};

export const GetPlayerCombinedInfo = async (): Promise<PlayerResult> => {
  const request = { InfoRequestParameters };
  return CallClientAPI<PlayerResult>('GetPlayerCombinedInfo', request);
};

export async function GetUserPublisherReadOnlyData(
  Keys: string[]
): Promise<PublisherDataResult> {
  return CallClientAPI<PublisherDataResult>('GetUserPublisherReadOnlyData', {
    Keys,
  });
}

export const GetUserPublisherData = async (): Promise<UserData> => {
  const { Data: PublisherData } = await GetUserPublisherReadOnlyData([
    'LinkedWallets',
    'DisplayName',
  ]);
  return { ...PublisherData };
};

export async function GetLinkedWallets(): Promise<string[]> {
  let linkedWallets: string[] = [];
  const { Data } = await GetUserPublisherReadOnlyData(['LinkedWallets']);
  if (Data) linkedWallets = parseLinkedWalletResult(Data);
  return linkedWallets;
}

/*************************************** UPDATE Account Info **********************************************/

export async function AddOrUpdateContactEmail(
  EmailAddress: string
): Promise<PlayFabClientModels.AddOrUpdateContactEmailResult> {
  return CallClientAPI<PlayFabClientModels.AddOrUpdateContactEmailResult>(
    'AddOrUpdateContactEmail',
    { EmailAddress }
  );
}

export async function UpdateAvatarUrl(
  ImageUrl: string
): Promise<PlayFabClientModels.EmptyResponse> {
  return CallClientAPI('UpdateAvatarUrl', { ImageUrl });
}

export async function UpdateUserPublisherData(
  Data: any,
  Permission = 'public'
): Promise<PlayFabClientModels.UpdateUserDataResult> {
  const request = { Data, Permission };
  return CallClientAPI<PublisherDataResult>('UpdateUserPublisherData', request);
}

/*************************************** Admin **********************************************/

export async function DeletePlayer(
  PlayFabId: string
): Promise<PlayFabAdminModels.DeletePlayerResult> {
  return new Promise((resolve, reject) => {
    PlayFabAdmin.DeletePlayer({ PlayFabId }, (error, result) => {
      if (error) {
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
  const linkedWallets = await GetLinkedWallets();
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
  const linkedWallets = await GetLinkedWallets();
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
