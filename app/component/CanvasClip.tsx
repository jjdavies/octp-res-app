import React, { useState } from 'react';
import Image from 'next/image';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Howl, Howler } from 'howler';

import builderStyles from '../styles/Builder.module.css';

import audioClip from '../img/buttons/audioClip.svg';
import audioClipHover from '../img/buttons/audioClipHover.svg';

interface ClipProps {
  src: string;
  format: string | undefined;
  clickHandler: Function;
  width: number;
  height: number;
}

export default function Clip(props: ClipProps) {
  const [pos, setPos] = useState();
  const [startPos, setStartPos] = useState<Object>({});

  const [hover, setHover] = useState<boolean>(false);

  const aud = new Howl({
    src: [props.src],
    format: props.format,
  });

  const divStyle = {
    width: props.width,
    height: props.height,
    zIndex: 99,
  };

  const startDrag: DraggableEventHandler = (e, ui) => {
    // console.log(thumbRect);
  };

  const stopDrag: DraggableEventHandler = (e, ui) => {
    const thumb = e.target as Element;
    // if (thumb != null)
    //   props.clipDrop(thumb.getBoundingClientRect(), props.audioFile);
  };

  const playHover = () => {
    setHover(true);
  };

  const playHoverOut = () => {
    setHover(false);
  };

  const playClip = () => {
    aud.play();
  };

  return (
    <div
      className={builderStyles.audioClipButton}
      onClick={() => props.clickHandler()}
      onTouchEnd={() => props.clickHandler()}
      style={divStyle}
    >
      <Image
        className={builderStyles.audioClipImage}
        src={hover ? audioClipHover : audioClip}
        alt="audio clip image"
        draggable="false"
        onMouseOver={playHover}
        onMouseOut={playHoverOut}
        onClick={playClip}
        onTouchEnd={playClip}
      />
    </div>
  );
}
