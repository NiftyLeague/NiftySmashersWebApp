import { useState, useEffect } from 'react';
import { isMacOs, isAndroid, isIOS, isWindows } from 'react-device-detect';

const COMMON_MSG = 'Available on Google Play!';

enum MSGS {
  // win: 'Download the Smashers Game Launcher for best performance or play in browser.',
  Windows = `Windows download will be enabled soon. ${COMMON_MSG}`,
  // android: 'Download the app in Google Play Store or play on desktop!',
  Android = 'Download the app on Google Play!',
  // ios: 'Game available on desktop or Android devices only. Stay tuned for our iOS release!',
  IOS = `${COMMON_MSG} Stay tuned for our iOS release.`,
  // linux: 'Linux support is not available at this time.',
  LINUX = `Linux support is not available at this time. ${COMMON_MSG}`,
  // osx: 'Download for Mac & iOS devices will be added soon. Play in browser today!',
  MAC = `${COMMON_MSG} Download for Mac & iOS will be added soon.`,
}

enum OS {
  Windows = 'win',
  Android = 'android',
  IOS = 'iOS',
  LINUX = 'linux',
  MAC = 'osx',
}

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'stage';
  const isLinux =
    typeof window !== 'undefined' &&
    window?.navigator?.userAgent?.indexOf('Linux') >= 0;
  let os = '';
  let message = '';

  if (isWindows) {
    os = OS.Windows;
    message = MSGS.Windows;
  } else if (isAndroid) {
    os = OS.Android;
    message = MSGS.Android;
  } else if (isIOS) {
    os = OS.IOS;
    message = MSGS.IOS;
  } else if (isLinux) {
    os = OS.LINUX;
    message = MSGS.LINUX;
  } else if (isMacOs) {
    os = OS.MAC;
    message = MSGS.MAC;
  }

  const fileName = `NiftyLauncher-setup-${version?.substring(
    0,
    version?.indexOf('-')
  )}.exe`;
  const downloadURL =
    os === 'win'
      ? `https://d7ct17ettlkln.cloudfront.net/launcher/${env}/${os}/${version}/${fileName}`
      : null;

  useEffect(() => {
    const fetchVersion = async () => {
      if (os === 'win') {
        const v: string = await fetch(
          `https://nifty-league.s3.amazonaws.com/launcher/${env}/${os}/version.bin?t=${Date.now()}`
        )
          .then(async res => {
            if (res.status >= 400) {
              console.error(await res.text());
              return '';
            }
            return res.text();
          })
          .catch(e => {
            console.error(e);
            return '';
          });
        setVersion(v);
      }
    };
    fetchVersion();
  }, [env, os]);

  return {
    downloadURL,
    version,
    isWindows,
    isLinux,
    isMacOs,
    message,
  };
};

export default useVersion;
