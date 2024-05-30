import React from 'react';
import DayNight from '../../component/scenes/DayNight';
import BF3School from '@/app/component/scenes/BF3U1School1';
import BF3SchoolDnd from '@/app/component/scenes/BF3U1School2';
import BF3SchoolGate from '@/app/component/scenes/BF3U1School3';
import NavArrow from '../../img/buttons/navArrow.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function SlugScene(props) {
  const slug = props.params.slug;
  return (
    <div>
      {slug === 'DayNight' && (
        <>
          <DayNight />
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
                alt="nav arrow"
              />
            </Link>
          </div>
        </>
      )}
      {slug === 'bf3school' && <BF3School />}
      {slug === 'bf3schooldnd' && <BF3SchoolDnd />}
      {slug === 'bf3schoolgate' && <BF3SchoolGate />}
      {/* <div>
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
      </div> */}
    </div>
  );
}
