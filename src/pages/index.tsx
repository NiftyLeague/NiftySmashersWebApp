import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import styles from '@/styles/smashers.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nifty Smashers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className={styles.main}>
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            <Image
              src="/logo/wordmark_logo_white_glow.png"
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
        <Modal />
      </section>
    </>
  );
}
