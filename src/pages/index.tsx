import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nifty Smashers</title>
        <meta
          name="description"
          content="Mobile and PC friendly brawler game"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container">
          <a href="https://niftyleague.com" target="_blank" rel="noreferrer">
            <div className="logo-container">
              <Image
                src="/logo/white.png"
                alt="Company Logo"
                className="logo"
                width={50}
                height={50}
              />
            </div>
          </a>
          <nav className="navbar">
            <div className="navbar-inner">
              <a
                href="https://discord.gg/niftyleague"
                target="_blank"
                rel="noreferrer"
                className="nav-item"
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
                className="nav-item"
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
                className="nav-item"
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
                className="nav-item"
              >
                <Image
                  src="/icons/opensea.svg"
                  alt="OpenSea Logo"
                  width={22}
                  height={22}
                />
              </a>
            </div>
            <a href="/dashboard">
              <div className="nav-item dashboard">
                <div className="dashboard-icon">
                  <Image
                    src="/icons/user.svg"
                    alt="Dashboard Icon"
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            </a>
          </nav>
          <div className="content">
            <Image
              src="/logo/wordmark_logo.png"
              alt="Wordmark Logo"
              className="wordmark"
              width={704}
              height={292}
            />
            <div className="buttons">
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
        <div id="modal" className="modal hidden">
          <div className="modal-content">
            <iframe id="modal-iframe" src="" frameBorder="0"></iframe>
          </div>
          <div className="close-icon">&times;</div>
        </div>
      </main>
    </>
  );
}
