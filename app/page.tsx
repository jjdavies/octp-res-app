import Image from 'next/image';
import styles from './page.module.css';
import uiStyles from './styles/UI.module.css';
import Link from 'next/link';
import ActivityIcon from './img/icons/play-button.svg';
import BuilderIcon from './img/buttons/build-button.svg';
import AnimatedScene from './img/icons/animatedScene.png';

export default function Page() {
  return (
    <main>
      <div className={uiStyles.mainMenu}>
        <Link
          href={'/builder'}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            margin: 'auto',
          }}
        >
          <div className={uiStyles.mainMenuItem}>
            <div className={uiStyles.mainMenuIcon}>
              <Image src={BuilderIcon} alt="builder icon" />
            </div>
            <div className={uiStyles.mainMenuHeading}>Builder</div>
            <div></div>
          </div>
        </Link>
        <Link
          href={'/activity'}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            margin: 'auto',
          }}
        >
          <div className={uiStyles.mainMenuItem}>
            <div className={uiStyles.mainMenuIcon}>
              <Image src={ActivityIcon} alt="activity icon" />
            </div>
            <div className={uiStyles.mainMenuHeading}>
              Interactive Activities
            </div>
            <div></div>
          </div>
        </Link>
        <Link
          href={'/scene'}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            margin: 'auto',
          }}
        >
          <div className={uiStyles.mainMenuItem}>
            <div className={uiStyles.mainMenuIcon}>
              <Image src={AnimatedScene}></Image>
            </div>
            <div className={uiStyles.mainMenuHeading}>
              Animated Scenes
            </div>
            <div></div>
          </div>
        </Link>
      </div>
    </main>
  );
}
