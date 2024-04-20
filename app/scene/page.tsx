import React from 'react';
import uiStyles from '../styles/UI.module.css';
import Link from 'next/link';

export default function page() {
  return (
    <div className={uiStyles.sceneMenu}>
      <Link href={'/scene/' + 'DayNight'}>
        <div className={uiStyles.sceneMenuItem}>DayNight</div>
      </Link>
    </div>
  );
}
