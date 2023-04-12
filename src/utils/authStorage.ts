import Cookies from 'universal-cookie';

const cookies = new Cookies();

/* Custom ID */

const chars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');

export function getRandomKey(size = 100) {
  const data = new Uint8Array(4 * size);
  window.crypto.getRandomValues(data);
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(chars[data[i * 4] % chars.length]);
  }
  return result.join('');
}

function setCookie(CustomID: string) {
  // Set a persistent cookie that contains the CustomID
  const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set the cookie expiration to 30 days from now
  cookies.set('CustomID', CustomID, {
    path: '/',
    expires: expirationDate,
  });
}

export function PersistCustomID(CustomID: string) {
  // TODO: encript CustomID
  setCookie(CustomID);
}

export function getCustomID() {
  return cookies.get('CustomID');
}

export function clearCustomID() {
  cookies.remove('CustomID');
}

/* Login Session */

function setSessionTicket(sessionTicket: string) {
  try {
    sessionStorage.setItem('SessionTicket', sessionTicket);
  } catch (e) {
    console.error('Error setting session ticket:', e);
  }
}

function setPlayFabId(playFabId: string) {
  try {
    sessionStorage.setItem('PlayFabId', playFabId);
  } catch (e) {
    console.error('Error setting PlayFabId:', e);
  }
}

function setCookies(
  SessionTicket: string,
  PlayFabId: string,
  rememberMe: boolean
) {
  // Set a persistent cookie that contains the session ticket
  const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set the cookie expiration to 30 days from now
  cookies.set('SessionTicket', SessionTicket, {
    path: '/',
    expires: expirationDate,
  });
  cookies.set('PlayFabId', PlayFabId, { path: '/', expires: expirationDate });
  if (rememberMe)
    cookies.set('PersistLogin', true, { path: '/', expires: expirationDate });
}

function setSession(SessionTicket: string, PlayFabId: string) {
  // Store the session ticket in memory or in a short-lived cookie
  setSessionTicket(SessionTicket);
  setPlayFabId(PlayFabId);
}

export function setUserAuth(
  result:
    | PlayFabClientModels.LoginResult
    | PlayFabClientModels.RegisterPlayFabUserResult,
  rememberMe: boolean
) {
  console.log('setUserAuth loginResult', result);
  const { SessionTicket, PlayFabId } = result;
  setCookies(SessionTicket ?? '', PlayFabId ?? '', rememberMe);
}

function getSessionTicket() {
  try {
    return (
      cookies.get('SessionTicket') || sessionStorage.getItem('SessionTicket')
    );
  } catch (e) {
    console.error('Error getting session ticket:', e);
    return null;
  }
}

function getPlayFabId() {
  try {
    return cookies.get('PlayFabId') || sessionStorage.getItem('PlayFabId');
  } catch (e) {
    console.error('Error getting PlayFabId:', e);
    return null;
  }
}

export function getUserAuth() {
  const sessionTicket = cookies.get('SessionTicket');
  const playFabId = cookies.get('PlayFabId');
  const persistLogin = Boolean(cookies.get('PersistLogin'));
  const customId = getCustomID();
  return { customId, sessionTicket, playFabId, persistLogin };
}
