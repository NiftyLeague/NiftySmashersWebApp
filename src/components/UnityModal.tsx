import { useEffect } from 'react';
import styles from '@/styles/modal.module.css';
import cn from 'classnames';

export default function UnityModal() {
  useEffect(() => {
    const playBtn = document.getElementById('play-btn');
    const closeBtn = document.getElementById('unity-close-icon');
    const modal = document.getElementById('unity-modal');

    const openModal = () => modal?.classList.remove('hidden');
    const closeModal = () => modal?.classList.add('hidden');

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
    <div id="unity-modal" className={cn(styles.modal, 'hidden')}>
      <div className={styles.modal_content}></div>
      <div id="unity-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
}
