import { useEffect, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { Button, Typography, Space } from '@supabase/ui';
import useVersion from '@/hooks/useVersion';
import useFlags from '@/hooks/useFlags';
import styles from '@/styles/modal.module.css';

const GOOGLE_PLAY_LINK =
  'https://play.google.com/store/apps/details?id=com.NiftyLeague.NiftySmashersAlpha&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1';
const APPLE_STORE_LINK = '';

const GameSelectModal = ({ launchGame }: { launchGame: () => void }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const playBtn = document.getElementById('play-btn');
    const closeBtn = document.getElementById('options-close-icon');
    const modal = document.getElementById('options-modal');

    const openModal = () => setVisible(true);
    const closeModal = (e: Event) => {
      if (e.target === modal || e.target === closeBtn) setVisible(false);
    };

    playBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    return function cleanup() {
      playBtn?.removeEventListener('click', openModal);
      modal?.removeEventListener('click', closeModal);
      closeBtn?.removeEventListener('click', closeModal);
    };
  }, []);

  return (
    <div id="options-modal" className={cn(styles.modal, { hidden: !visible })}>
      <div className={styles.modal_paper_dark}>
        {visible && (
          <ModalContent
            closeModal={() => setVisible(false)}
            launchGame={launchGame}
          />
        )}
      </div>
      <div id="options-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
};

const ModalContent = ({
  closeModal,
  launchGame,
}: {
  closeModal: () => void;
  launchGame: () => void;
}) => {
  const { isWindows, downloadURL, version, message } = useVersion();
  const loading = !version && isWindows;
  const { enableWebGL } = useFlags();

  return (
    <Space
      size={4}
      direction="vertical"
      className={styles.model_select_view_content}
    >
      <Space size={4} direction="horizontal">
        <Image
          src="/logo/white.png"
          alt="Company Logo"
          width={50}
          height={48}
        />
        <Typography.Title level={2}>Let&apos;s Brawl!</Typography.Title>
      </Space>
      <Typography.Text type="secondary" className={styles.secondary}>
        {message}
      </Typography.Text>
      <Typography.Text>
        This brawl-style action game will have you white-knuckled and on the
        edge of your seat as you try to out-smash your opponent in a
        winner-takes-all battle!
      </Typography.Text>
      <Space direction="horizontal" style={{ marginTop: 20 }}>
        {/* <Button
          id="internal-close-icon"
          block
          type="outline"
          onClick={closeModal}
          className={styles.button_secondary}
        >
          Close
        </Button> */}
        <a
          href={GOOGLE_PLAY_LINK}
          target="_blank"
          rel="noreferrer"
          style={{ width: '100%' }}
        >
          <Image
            src="/assets/google-play-badge.png"
            alt="Get it on Google Play"
            width={564}
            height={169}
            style={{ width: '100%', height: 'auto' }}
          />
        </a>
        <a
          aria-disabled
          target="_blank"
          rel="noreferrer"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <Image
            src="/assets/apple-store-badge.svg"
            alt="Apple Store Badge"
            width={120}
            height={40}
            style={{
              width: '92%',
              height: 'auto',
              opacity: 0.25,
            }}
          />
        </a>
        {enableWebGL ? (
          <>
            {isWindows && (
              <a href={downloadURL || ''}>
                <Button
                  block
                  disabled={!isWindows || !version}
                  className={styles.button_primary}
                  icon={
                    <Image
                      src="/icons/windows.svg"
                      alt="Windows Logo"
                      width={22}
                      height={22}
                    />
                  }
                >
                  {loading ? 'Fetching version...' : 'Download'}
                </Button>
              </a>
            )}
            <Button
              block
              onClick={launchGame}
              className={styles.button_primary}
              icon={
                <Image
                  src="/icons/webgl.svg"
                  alt="Webgl Logo"
                  width={22}
                  height={22}
                />
              }
            >
              Browser
            </Button>
          </>
        ) : null}
      </Space>
    </Space>
  );
};

export default GameSelectModal;
