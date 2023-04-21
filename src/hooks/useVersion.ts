import { useState, useEffect } from 'react';
import { isMacOs, isAndroid, isIOS, isWindows } from 'react-device-detect';

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'stage';
  const isLinux =
    typeof window !== 'undefined' &&
    window?.navigator?.userAgent?.indexOf('Linux') >= 0;
  let os = '';
  let message = '';

  if (isWindows) {
    os = 'win';
    message =
      'Download the Smashers Game Launcher for best performance or play in browser.';
  } else if (isAndroid) {
    os = 'android';
    message = 'Download the app in Google Play Store or play on desktop!';
  } else if (isIOS) {
    os = 'iOS';
    message =
      'Game available on desktop or Android devices only. Stay tuned for our iOS release!';
  } else if (isLinux) {
    os = 'linux';
    message = 'Linux support is not available at this time.';
  } else if (isMacOs) {
    os = 'osx';
    message = 'Download for Mac OS will be added soon. Play in browser today!';
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
