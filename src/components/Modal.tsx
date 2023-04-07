import Script from 'next/script';
import styles from '@/styles/modal.module.css';
import cn from 'classnames';

export default function Modal() {
  return (
    <>
      <Script
        id="modal-handler"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            const trailerBtn = document.getElementById("trailer-btn");
            const playBtn = document.getElementById("play-btn");
            const modal = document.getElementById("modal");
            const modalIframe = document.getElementById("modal-iframe");
            const closeBtn = document.getElementById("close-icon");
          
            function openModal(src) {
              modalIframe.src = src;
              modal.classList.remove("hidden");
            }
          
            function closeModal() {
              modalIframe.src = "";
              modal.classList.add("hidden");
            }
          
            trailerBtn.addEventListener("click", () => {
              openModal("https://www.youtube.com/embed/CroLiLm4cto");
            });
          
            playBtn.addEventListener("click", () => {
              openModal("your_unity_webgl_url");
            });
          
            modal.addEventListener("click", (e) => {
              if (e.target === modal) closeModal();
            });

            closeBtn.addEventListener("click", (e) => {
              closeModal();
            });         
        `,
        }}
      />
      <div id="modal" className={cn(styles.modal, 'hidden')}>
        <div className={styles.modal_content}>
          <iframe
            id="modal-iframe"
            className={styles.modal_iframe}
            src=""
            frameBorder="0"
          ></iframe>
        </div>
        <div id="close-icon" className={styles.close_icon}>
          &times;
        </div>
      </div>
    </>
  );
}
