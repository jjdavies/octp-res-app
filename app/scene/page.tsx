import React from 'react';
import uiStyles from '../styles/UI.module.css';
import Link from 'next/link';
import Image from 'next/image';
import NavArrow from '../img/buttons/navArrow.svg';

export default function page() {
  return (
    <div className={uiStyles.sceneMenu}>
      <Link href="/">
        <Image
          src={NavArrow}
          style={{ transform: 'rotate(180deg)' }}
          width={100}
          height={100}
        />
      </Link>
      <Link href={'/scene/' + 'DayNight'}>
        <div className={uiStyles.sceneMenuItem}>
          DayNight
          <Image
            src={'/scenethumbs/' + 'daynightscenethumb' + '.png'}
            width={150}
            height={100}
            alt="day night scene thumb"
          ></Image>
        </div>
      </Link>
    </div>
  );
}
