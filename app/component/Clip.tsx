import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Howl, Howler } from 'howler';

import AudioFile from '../interfaces/AudioFile';

import builderStyles from '../styles/Builder.module.css';

import audioClip from '../img/buttons/audioClip.svg';
import audioClipHover from '../img/buttons/audioClipHover.svg';

interface ClipProps {
  audioFile: AudioFile;
  clipDrop: Function;
}

export default function Clip(props: ClipProps) {
  const [pos, setPos] = useState();
  const [startPos, setStartPos] = useState<Object>({});

  const imgRef = useRef();

  const [hover, setHover] = useState<boolean>(false);

  const audioClipImg = audioClip;
  const audioClipHoverImg = audioClipHover;

  const aud = new Howl({
    src: [props.audioFile.url],
    format: props.audioFile.format,
  });

  const startDrag: DraggableEventHandler = (e, ui) => {
    // console.log(thumbRect);
  };

  const stopDrag: DraggableEventHandler = (e, ui) => {
    // const thumb = e.target as Element;
    const thumb = imgRef.current;
    console.log(imgRef.current);
    if (thumb != null)
      props.clipDrop(thumb.getBoundingClientRect(), props.audioFile);
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
    <Draggable
      onStart={startDrag}
      onStop={stopDrag}
      position={{ x: 0, y: 0 }}
      cancel="img"
    >
      <div
        className={builderStyles.audioClipButton}
        style={{ zIndex: 99 }}
        ref={imgRef}
      >
        Clip
        <Image
          className={builderStyles.audioClipImage}
          src={hover ? audioClipHover : audioClip}
          alt=""
          draggable="false"
          onMouseOver={playHover}
          onMouseOut={playHoverOut}
          onClick={playClip}
        />
      </div>
    </Draggable>
  );
}
