import React from 'react';
import Image from 'next/image';

import builderStyles from '../../styles/Builder.module.css';
import ButtonData from '../../interfaces/ButtonData';

import lock from '../../img/buttons/lock.svg';
import unlock from '../../img/buttons/unlock.svg';
import ActivityStage from '../../interfaces/ActivityStage';

interface ButtonProps {
  activityStage: ActivityStage | null;
  disabled: boolean;
  selectedImage: string;
  buttonHandler: Function;
}

export default function LockButton(props: ButtonProps) {
  const disabled = props.disabled;
  const style = {
    filter: `saturate(${disabled ? 0 : 100}%)`,
  };
  const buttonHandler = () => {
    props.buttonHandler(props.buttonHandler);
  };

  let src = unlock;
  if (props.activityStage) {
    if (props.selectedImage !== '') {
      const image =
        props.activityStage.activitySettings.resources.filter(
          (img) => img.resourceID === props.selectedImage
        )[0];
      console.log(image);
      if (image)
        src = image.resourceSettings.buildLocked ? lock : unlock;
    }

    // src = image.resourceSettings.buildLocked ? unlock : lock;
  }

  return (
    <div className={builderStyles.button} onClick={buttonHandler}>
      <Image
        className={builderStyles.buttonImage}
        src={src}
        width={200}
        height={200}
        style={style}
        alt="props.data.name"
      />
    </div>
  );
}
