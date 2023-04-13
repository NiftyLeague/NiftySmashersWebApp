// import {
//   recoverTypedSignature,
//   SignTypedDataVersion,
//   TypedMessage,
//   MessageTypes,
//   TypedDataUtils,
// } from '@metamask/eth-sig-util';
import { providers } from 'ethers';
import crypto from 'crypto';
import { playfab } from '@/utils/initPlayfab';
import { PlayFabCloudScript } from 'playfab-sdk';

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

function generateMessage(address: string, nonce: string) {
  const addressToLower = address.toLowerCase();
  const signAddress = `${addressToLower.substring(
    0,
    6
  )}...${addressToLower.substring(addressToLower.length - 4)}`;
  return `Please sign this message to verify that ${signAddress} belongs to you. ${nonce}`;
}

async function getSigner() {
  if (!window.ethereum) throw new Error('No Ethereum provider found');
  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  // Get the Provider/Signer
  const provider = new providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

export async function signMessage() {
  //   const signer = await getWeb3();
  const signer = await getSigner();
  if (signer) {
    const address = await signer.getAddress();
    const nonce = `0x${crypto.randomBytes(4).toString('hex')}`;
    const message = generateMessage(address, nonce);
    // const signature = await web3.eth.personal.sign(message, address, '');
    const signature = await signer.signMessage(message);
    return {
      address,
      message,
      nonce,
      signature,
    };
  }
  return null;
}

async function isEthereumSignatureValid(
  address: string,
  signature: string,
  nonce: string
): Promise<boolean> {
  if (!address || !signature || !nonce) return false;
  const message = generateMessage(address, nonce);
  return true;
  // TODO: fix signiture validation
  //   console.log('isEthereumSignatureValid.address', address);
  //   console.log('isEthereumSignatureValid.signature', signature);
  //   console.log('isEthereumSignatureValid.nonce', nonce);
  //   console.log('isEthereumSignatureValid.message', message);

  //   const msgParams: TypedMessage<MessageTypes> = {
  //     domain: {
  //       chainId: 1,
  //       version: '1',
  //     },
  //     message: { message },
  //     primaryType: 'Message',
  //     types: {
  //       EIP712Domain: [
  //         { name: 'version', type: 'string' },
  //         { name: 'chainId', type: 'uint256' },
  //       ],
  //       Message: [{ name: 'message', type: 'string' }],
  //     },
  //   };
  //   const typedData = TypedDataUtils.sanitizeData(msgParams);
  //   const typedDataHash = TypedDataUtils.hashStruct(
  //     typedData.primaryType.toString(),
  //     typedData.message,
  //     typedData.types,
  //     SignTypedDataVersion.V4
  //   );
  //   const signatureArray = ethers.utils.splitSignature(signature);
  //   const recoveredAddress = await ethers.utils.recoverAddress(
  //     typedDataHash,
  //     signatureArray
  //   );
  //   console.log('isEthereumSignatureValid.recoveredAddress', recoveredAddress);
  //   return recoveredAddress.toLowerCase() === address.toLowerCase();

  //   const data = [
  //     {
  //       type: 'string',
  //       name: 'message',
  //       value: message,
  //     },
  //   ];
}

async function GetLinkedWallets(): Promise<PlayFabClientModels.GetUserDataResult> {
  return new Promise((resolve, reject) => {
    playfab.GetUserPublisherReadOnlyData(
      { Keys: ['LinkedWallets'] },
      function (error, result) {
        if (error) {
          console.error(
            'GetUserPublisherReadOnlyData Error:',
            error.errorMessage
          );
          reject(error);
        } else {
          resolve(result.data);
        }
      }
    );
  });
}

const safeJSONParse = (input: any) => {
  let output = [];
  try {
    output = JSON.parse(input);
  } catch (e) {
    if (e instanceof SyntaxError || e instanceof TypeError) {
      console.error(`Error parsing JSON: ${e.message}`);
    } else {
      console.error(`Unknown error: ${e}`);
    }
  }
  return output;
};

export const parseLinkedWalletResult = (data?: {
  [key: string]: PlayFabClientModels.UserDataRecord;
}): string[] => {
  return safeJSONParse(data?.LinkedWallets?.Value);
};

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

  return new Promise((resolve, reject) => {
    let error = null;
    if (chain != 'ethereum')
      error = new Error('Only Ethereum wallets are supported at this time');

    if (!isEthereumSignatureValid(address, signature, nonce))
      error = new Error('Failed to validate signature');

    const walletEntry = `${chain}:${address}`.toLowerCase();
    if (linkedWallets.includes(walletEntry))
      error = new Error(
        `${address.substring(
          0,
          6
        )}... address is already linked to this account`
      );

    if (error) {
      reject(error);
      return;
    }

    const FunctionName = 'Accounts_LinkWallet';
    const FunctionParameter = {
      Chain: chain,
      Address: address.toLowerCase(),
      Signature: signature,
      Nonce: nonce,
    };

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
