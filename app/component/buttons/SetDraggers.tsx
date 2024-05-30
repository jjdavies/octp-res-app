import React from 'react';
import Image from 'next/image';

import builderStyles from '../../styles/Builder.module.css';
import ButtonData from '../../interfaces/ButtonData';

import setDraggersSVG from '../../img/buttons/setDraggers.svg';
import setDraggersActiveSVG from '../../img/buttons/setDraggersActive.svg';
import Activity from '../../interfaces/NewActivity';

interface ButtonProps {
  activityData: Activity | null;
  buttonHandler: Function;
  settingDraggersActive: boolean;
  setDraggers: Function;
}

export default function SetDraggers(props: ButtonProps) {
  const buttonHandler = () => {
    props.buttonHandler(props.buttonHandler);
  };

  const src = props.settingDraggersActive
    ? setDraggersActiveSVG
    : setDraggersSVG;

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
