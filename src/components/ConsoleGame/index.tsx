import { memo } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import styles from './index.module.css';

const ConsoleGame = ({ src }: { src: string }) => {
  function playVid() {
    const vid = document.getElementById('console-video') as HTMLVideoElement;
    vid?.play();
  }

  return (
    <div style={{ position: 'relative' }}>
      <AnimatedWrapper>
        <div
          style={{ position: 'relative', display: 'flex', flexGrow: 1 }}
          className="animated-fade-slow animated-fade-start transition-delay-small animation-sm-hidden"
        >
          <Image
            alt="Classic Gaming Reinvented"
            className="pixelated"
            width={4842}
            height={3371}
            src="/assets/console-game/classic-gaming-reinvented-notv.png"
            priority
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <video
            id="console-video"
            width="100%"
            height="100%"
            muted
            autoPlay
            loop
            playsInline
            data-keepplaying
            className={styles.game_video}
          >
            <source src={src} type="video/mp4" />
          </video>
          <div
            onClick={playVid}
            className={cn(styles.bonk_note, 'animated-fade-start animated-fade transition-delay-medium')}
          >
            <Image
              alt="Classic Gaming Reinvented Bonk"
              className="pixelated"
              width={4842}
              height={3371}
              src="/assets/console-game/bonk.png"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </AnimatedWrapper>
      <div className={styles.gaming_controller}>
        <AnimatedWrapper parallax parallaxDirection="bottom" transitionAmount="small">
          <div className="animation-bounce animated-fade-start animated-fade transition-delay-large">
            <Image
              alt="Classic Gaming Reinvented Controller Left"
              className="pixelated"
              width={4842}
              height={3371}
              src="/assets/console-game/gaming_controller_left.png"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className={styles.gaming_controller}>
        <AnimatedWrapper parallax parallaxDirection="bottom" transitionAmount="small">
          <div className="animation-bounce2 animated-fade-start animated-fade transition-delay-large">
            <Image
              alt="Classic Gaming Reinvented Controller Right"
              className="pixelated"
              width={4842}
              height={3371}
              src="/assets/console-game/gaming_controller_right.png"
              priority
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className="radial-gradient-bg" style={{ height: '110%' }} />
    </div>
  );
};

export default memo(ConsoleGame);
