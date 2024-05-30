import React from 'react';
import Image from 'next/image';

import builderStyles from '../styles/Builder.module.css';
import ButtonData from '../interfaces/ButtonData';

import bringToFront from '../img/icons/bringToFront.svg';
import lock from '../img/icons/lock.svg';
import unlock from '../img/icons/unlock.svg';
// import sendToBack from '../img/icons/sendToBack.png';

interface ButtonProps {
  buttonData: ButtonData;
  disabled: boolean;
  buttonHandler: Function;
}

export default function Button(props: ButtonProps) {
  const disabled = props.disabled;
  const style = {
    filter: `saturate(${disabled ? 0 : 100}%)`,
  };
  const buttonHandler = () => {
    if (!disabled) props.buttonHandler(props.buttonData.action);
  };
  return (
    <div className={builderStyles.button} onClick={buttonHandler}>
      <Image
        className={builderStyles.buttonImage}
        src={props.buttonData.icon}
        width={200}
        height={200}
        style={style}
        alt="props.data.name"
      />
    </div>
  );
}
