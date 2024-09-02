import React, { useRef, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import Image from 'next/image';

import builderStyles from '../styles/Builder.module.css';

import pendingWheel from '../img/icons/pending.gif';

interface ThumbProps {
  src: string;
  thumbDrop: Function;
}

export default function Thumb(props: ThumbProps) {
  const [pos, setPos] = useState();
  const [startPos, setStartPos] = useState<Object>({});
  const [thumbStatus, setThumbStatus] = useState<string>('loaded');

  const imgRef = useRef(null);

  const startDrag: DraggableEventHandler = (e, ui) => {
    // console.log(thumbRect);
  };

  const stopDrag: DraggableEventHandler = (e, ui) => {
    // const thumb = e.target as Element;
    const thumb = imgRef.current;
    console.log(thumb);
    if (thumb != null) {
      const thumbEl: HTMLElement = thumb;
      props.thumbDrop(thumbEl.getBoundingClientRect(), props.src);
    }
  };

  return (
    <Draggable
      onStart={startDrag}
      onStop={stopDrag}
      position={{ x: 0, y: 0 }}
    >
      <div>
        <Image
          ref={imgRef}
          className={builderStyles.sidePaneThumb}
          src={props.src}
          alt=""
          draggable="false"
          style={{ zIndex: 99 }}
        />
        {thumbStatus === 'pending' && (
          <Image
            src={pendingWheel}
            style={{
              position: 'relative',
              width: '20%',
              height: 'auto',
              left: '50%',
              top: '-50%',
            }}
            draggable={false}
            alt="pending wheel"
          />
        )}
        {/* {thumbStatus==='uploaded' &&
        <Image className={builderStyles.uploadedTick} src={uploaded} />
      } */}
      </div>
    </Draggable>
  );
}
