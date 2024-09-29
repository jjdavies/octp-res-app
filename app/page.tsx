'use client';
import React, { KeyboardEvent, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import uiStyles from './styles/UI.module.css';
import Link from 'next/link';
import ActivityIcon from './img/icons/play-button.svg';
import BuilderIcon from './img/buttons/build-button.svg';
import MediaIcon from './img/icons/multimedia.png';
import AnimatedScene from './img/icons/animatedScene.png';
import Words from './img/icons/words.png';
import { ChangeEvent } from 'react';

export default function Page() {
  const searchButtonRef = useRef(null);
  const [wordInputValue, setWordInputValue] = useState('');

  const wordInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWordInputValue(e.target.value);
  };

  const checkKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchButtonRef && searchButtonRef.current !== null) {
        const button =
          searchButtonRef.current as unknown as HTMLElement;
        button.click();
      }
    }
  };

  return (
    <main>
      <div className={uiStyles.menuContainer}>
        {/* <div className={uiStyles.mainMenu}> */}
        {/* <Link
            href={'/words'}
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              margin: 'auto',
            }}
          > */}
        <div className={uiStyles.mainMenuItem}>
          <div
            className={uiStyles.mainMenuIcon}
            style={{ margin: '20px 0' }}
          >
            <Image src={Words} alt="builder icon" />
          </div>
          <div
            className={uiStyles.mainMenuHeading}
            style={{ display: 'flex' }}
          >
            Word Checker
            <input
              className={uiStyles.wordInput}
              type="text"
              value={wordInputValue}
              onChange={wordInputValueChange}
              onKeyDown={(e) => checkKeyDown(e)}
            />
            <Link
              href={`/words/${wordInputValue}`}
              // style={{
              //   display: 'flex',
              //   width: '100%',
              //   justifyContent: 'center',
              //   margin: 'auto',
              // }}
            >
              <button
                ref={searchButtonRef}
                style={{
                  width: 'fit-content',
                  height: '100%',
                  fontSize: '30px',
                  background: 'blue',
                  padding: '0, 3px',
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            </Link>
          </div>
        </div>
        {/* </Link> */}
        {/* </div> */}
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
            href={'/media'}
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              margin: 'auto',
            }}
          >
            <div className={uiStyles.mainMenuItem}>
              <div className={uiStyles.mainMenuIcon}>
                <Image src={MediaIcon} alt="media icon" />
              </div>
              <div className={uiStyles.mainMenuHeading}>
                Multimedia
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
                <Image
                  src={AnimatedScene}
                  alt="animated scene"
                ></Image>
              </div>
              <div className={uiStyles.mainMenuHeading}>
                Animated Scenes
              </div>
              <div></div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
