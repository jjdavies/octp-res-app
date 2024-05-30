import React from 'react';
import Image from 'next/image';

import Activity from '../../interfaces/NewActivity';

import builderStyles from '../../styles/Builder.module.css';

import setConnection from '../../img/buttons/setConnection.svg';
import setConnectionActive from '../../img/buttons/setConnectionActive.svg';

interface ButtonProps {
  activityData: Activity | null;
  buttonHandler: Function;
  settingConnectionActive: boolean;
  setConnection: Function;
  disabled: boolean;
}

export default function SetConnection(props: ButtonProps) {
  const src = props.settingConnectionActive
    ? setConnectionActive
    : setConnection;

  const buttonHandler = () => {
    props.buttonHandler();
  };

  return (
    <div className={builderStyles.button} onClick={buttonHandler}>
      <Image
        className={builderStyles.buttonImage}
        src={src}
        width={200}
        height={200}
        alt="props.data.name"
      />
    </div>
  );
}
