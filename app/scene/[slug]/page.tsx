import React from 'react';
import DayNight from '../../component/scenes/DayNight';
import NavArrow from '../../img/buttons/navArrow.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function SlugScene(props) {
  const slug = props.params.slug;
  return (
    <div>
      {slug === 'DayNight' && <DayNight />}
      <div>
        <Link href="/scene">
          <Image
            src={NavArrow}
            width={100}
            height={100}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(180deg)',
            }}
          />
        </Link>
      </div>
    </div>
  );
}
