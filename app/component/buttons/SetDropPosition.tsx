import React from 'react';
import Image from 'next/image';

import builderStyles from '../../styles/Builder.module.css';
import ButtonData from '../../interfaces/ButtonData';

import setDropPositionSVG from '../../img/buttons/setDropTarget.svg';
import setDropPositionActiveSVG from '../../img/buttons/setDropTargetActive.svg';
import Activity from '../../interfaces/NewActivity';

interface ButtonProps {
  activityData: Activity | null;
  buttonHandler: Function;
  settingDropPositionActive: boolean;
  setDraggers: Function;
}

export default function setDropPosition(props: ButtonProps) {
  const buttonHandler = () => {
    console.log('set drop');
    props.buttonHandler(props.buttonHandler);
  };

  const src = props.settingDropPositionActive
    ? setDropPositionActiveSVG
    : setDropPositionSVG;

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
