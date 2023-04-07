import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import styles from '@/styles/smashers.module.css';
import cn from 'classnames';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nifty Smashers</title>
      </Head>
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
      <main className={styles.main}>
        <div className={styles.container}>
          <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
            <div className={styles.logo_container}>
              <Image
                src="/logo/white.png"
                alt="Company Logo"
                className={styles.logo}
                width={50}
                height={50}
              />
            </div>
          </a>
          <nav className={styles.navbar}>
            <div className={styles.navbar_inner}>
              <a
                href="https://discord.gg/niftyleague"
                target="_blank"
                rel="noreferrer"
                className={styles.nav_item}
              >
                <Image
                  src="/icons/discord.svg"
                  alt="Discord Logo"
                  width={22}
                  height={22}
                />
              </a>
              <a
                href="https://twitter.com/NiftyLeague"
                target="_blank"
                rel="noreferrer"
                className={styles.nav_item}
              >
                <Image
                  src="/icons/twitter.svg"
                  alt="Twitter Logo"
                  width={22}
                  height={22}
                />
              </a>
              <a
                href="https://www.twitch.tv/niftyleagueofficial"
                target="_blank"
                rel="noreferrer"
                className={styles.nav_item}
              >
                <Image
                  src="/icons/twitch.svg"
                  alt="Twitch Logo"
                  width={22}
                  height={22}
                />
              </a>
              <a
                href="https://opensea.io/collection/niftydegen"
                target="_blank"
                rel="noreferrer"
                className={styles.nav_item}
              >
                <Image
                  src="/icons/opensea.svg"
                  alt="OpenSea Logo"
                  width={22}
                  height={22}
                />
              </a>
            </div>
            <a href="/profile">
              <div className={cn(styles.nav_item, styles.profile)}>
                <div className={styles.profile_icon}>
                  <Image
                    src="/icons/user.svg"
                    alt="Profile Icon"
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            </a>
          </nav>
          <div className={styles.content}>
            <Image
              src="/logo/wordmark_logo.png"
              alt="Wordmark Logo"
              className={styles.wordmark}
              width={704}
              height={292}
            />
            <div className={styles.buttons}>
              <button id="trailer-btn">
                <Image
                  src="/icons/youtube.svg"
                  alt="YouTube Logo"
                  width={22}
                  height={22}
                />
                Trailer
              </button>
              <button id="play-btn">
                <Image
                  src="/icons/controller.svg"
                  alt="Game Icon"
                  width={22}
                  height={22}
                />
                Play
              </button>
            </div>
          </div>
        </div>
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
      </main>
    </>
  );
}
