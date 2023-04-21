import { useEffect } from 'react';
import styles from '@/styles/modal.module.css';
import cn from 'classnames';

export default function TrailerModal() {
  useEffect(() => {
    const trailerBtn = document.getElementById('trailer-btn');
    const closeBtn = document.getElementById('trailer-close-icon');
    const modal = document.getElementById('trailer-modal');
    const modalIframe = document.getElementById(
      'trailer-modal-iframe'
    ) as HTMLIFrameElement;
    const openModal = () => {
      modal?.classList.remove('hidden');
      modalIframe?.contentWindow?.postMessage(
        '{"event":"command","func":"' + 'playVideo' + '","args":""}',
        '*'
      );
    };
    const closeModal = () => {
      modal?.classList.add('hidden');
      modalIframe?.contentWindow?.postMessage(
        '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
        '*'
      );
    };

    trailerBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    return function cleanup() {
      trailerBtn?.removeEventListener('click', openModal);
      modal?.removeEventListener('click', closeModal);
      closeBtn?.removeEventListener('click', closeModal);
    };
  }, []);

  return (
    <div id="trailer-modal" className={cn(styles.modal, 'hidden')}>
      <div className={styles.modal_content}>
        <iframe
          id="trailer-modal-iframe"
          className={styles.modal_iframe}
          src="https://www.youtube.com/embed/CroLiLm4cto?autoplay=1&enablejsapi=1&html5=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
        ></iframe>
      </div>
      <div id="trailer-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
}
