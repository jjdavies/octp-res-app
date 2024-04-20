import React from 'react';
import DayNight from '../../component/scenes/DayNight';
import NavArrowActive from '../../img/buttons/navArrow.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function SlugScene(props) {
  const slug = props.params.slug;
  return (
    <div>
      {slug === 'DayNight' && <DayNight />}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(180deg)',
        }}
      >
        <Link href="/scene">
          <Image src={NavArrowActive} />
        </Link>
      </div>
    </div>
  );
}
