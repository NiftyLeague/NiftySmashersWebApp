import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            document.addEventListener("DOMContentLoaded", () => {
              const trailerBtn = document.getElementById("trailer-btn");
              const playBtn = document.getElementById("play-btn");
              const modal = document.getElementById("modal");
              const modalIframe = document.getElementById("modal-iframe");
              const closeBtn = document.querySelector('.close-icon');
            
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
            });            
          `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
