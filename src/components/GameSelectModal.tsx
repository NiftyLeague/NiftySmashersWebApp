import { useEffect, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';
import { Button, Typography, Space } from '@supabase/ui';
import useVersion from '@/hooks/useVersion';
import styles from '@/styles/modal.module.css';

const GameSelectModal = ({ launchGame }: { launchGame: () => void }) => {
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const closeModal = (e: Event) => {
    const closeBtn = document.getElementById('options-close-icon');
    const closeBtn2 = document.getElementById('internal-close-icon');
    const modal = document.getElementById('options-modal');
    if (e.target === modal || e.target === closeBtn || e.target === closeBtn2)
      setVisible(false);
  };

  useEffect(() => {
    const playBtn = document.getElementById('play-btn');
    const closeBtn = document.getElementById('options-close-icon');
    const modal = document.getElementById('options-modal');

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
          <ModalContent closeModal={closeModal} launchGame={launchGame} />
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
  closeModal: (e: Event) => void;
  launchGame: () => void;
}) => {
  const { isWindows, downloadURL, version, message } = useVersion();
  const loading = !version && isWindows;

  const handleAndroidDownload = () => {};

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
        As Nifty League&apos;s main game, this brawl-styles action game will
        have you white-knuckled and on the edge of your seat as you try to
        out-click, out-smart and out-smash your opponent in a winner-takes-all
        DEGEN battle!
      </Typography.Text>
      <Space direction="horizontal" style={{ marginTop: 25 }}>
        <Button
          id="internal-close-icon"
          block
          type="outline"
          onClick={e => closeModal(e as unknown as Event)}
          className={styles.button_secondary}
        >
          Close
        </Button>
        <Button
          block
          type="outline"
          icon={
            <Image
              src="/icons/android.svg"
              alt="Android Logo"
              width={22}
              height={22}
            />
          }
          onClick={handleAndroidDownload}
          className={styles.button_mobile}
        />
        <Button
          block
          type="outline"
          icon={
            <Image
              src="/icons/apple.svg"
              alt="Apple Logo"
              width={22}
              height={22}
            />
          }
          disabled
          className={styles.button_mobile}
        />
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
      </Space>
    </Space>
  );
};

export default GameSelectModal;
