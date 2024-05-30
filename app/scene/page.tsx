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
          alt="navarrowback"
        />
      </Link>
      <Link href={'/scene/' + 'DayNight'} style={{ height: '100px' }}>
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
      <Link href={'/scene/' + 'bf3school'}>
        <div className={uiStyles.sceneMenuItem}>
          School
          <Image
            src={'/scenethumbs/' + 'bf3schoolscenethumb' + '.png'}
            width={150}
            height={100}
            alt="school scene thumb"
          ></Image>
        </div>
      </Link>
      <Link href={'/scene/' + 'bf3schooldnd'}>
        <div className={uiStyles.sceneMenuItem}>
          School (Drag-and-Drop)
          <Image
            src={'/scenethumbs/' + 'bf3schooldndscenethumb' + '.png'}
            width={150}
            height={100}
            alt="school dnd scene thumb"
          ></Image>
        </div>
      </Link>
    </div>
  );
}
