import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import GameSection from '@/components/GameSection';
import DegensSection from '@/components/DegensSection';
import Footer from '@/components/Footer';
import TrailerModal from '@/components/TrailerModal';
import GameSelectModal from '@/components/GameSelectModal';
import UnityModal from '@/components/UnityModal';
import styles from '@/styles/smashers.module.css';

export default function Home() {
  const [gameOpen, setGameOpen] = useState(false);
  const launchGame = () => setGameOpen(true);
  const closeGame = () => setGameOpen(false);
  return (
    <>
      <Head>
        <title>Nifty Smashers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Nifty Smashers - Free to Play Fighting Game"
        />
        <meta
          name="description"
          content="Nifty Smashers is a free 3D platform fighting game that supports up to 16 online players. Available on iOS & Android devices - full cross-play coming soon!"
          key="desc"
        />
        <meta
          property="og:description"
          content="Nifty Smashers is a free 3D platform fighting game that supports up to 16 online players. Available on iOS & Android devices - full cross-play coming soon!"
        />
        <meta
          property="og:image"
          content="https://niftysmashers.com/assets/console-game/classic-gaming-reinvented.png"
        />
      </Head>
      <section className={styles.main}>
        <div className="radial-gradient-bg-centered" />
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            <Image
              src="/logo/wordmark_logo_smashers.png"
              alt="Wordmark Logo"
              className={styles.wordmark}
              width={800}
              height={548}
              priority
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
      </section>
      <section className={styles.console_game}>
        <ConsoleGame src="/assets/smashers.mp4" />
      </section>
      <section className={styles.game_details}>
        <GameSection />
      </section>
      <section className={styles.character_details}>
        <DegensSection />
      </section>
      <Footer classes={{ footer: styles.footer }} />
      <TrailerModal />
      <GameSelectModal launchGame={launchGame} />
      <UnityModal gameOpen={gameOpen} closeGame={closeGame} />
    </>
  );
}
