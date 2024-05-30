import React from 'react';
import Image from 'next/image';
import builderStyles from '../../styles/Builder.module.css';
import RightPaneButtonImage from '../../img/buttons/rightPaneButton.svg';
import RightPaneButtonActiveImage from '../../img/buttons/rightPaneButtonActive.svg';

interface ActionsPaneButtonProps {
  buttonHandler: Function;
  active: boolean;
}

export default function ActionsPaneButton(
  props: ActionsPaneButtonProps
) {
  const buttonSrc = props.active
    ? RightPaneButtonActiveImage
    : RightPaneButtonImage;
  return (
    <div
      className={builderStyles.button}
      onClick={props.buttonHandler}
    >
      <Image
        className={builderStyles.buttonImage}
        src={buttonSrc}
        width={200}
        height={200}
        // style={style}
        alt="props.data.name"
      />
    </div>
  );
}
