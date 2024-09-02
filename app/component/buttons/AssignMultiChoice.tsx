import React from 'react';
import Image from 'next/image';

import builderStyles from '../../styles/Builder.module.css';

interface AssignMultiChoiceProps {
  src: string;
  buttonHandler: Function;
  selectedImage: string;
  active: boolean;
}

export default function AssignMultiChoice(
  props: AssignMultiChoiceProps
) {
  const activeStyle = {
    filter: `saturate(${!props.active ? 0 : 100}%)`,
  };
  return (
    <div
      className={builderStyles.button}
      onClick={() => props.buttonHandler}
    >
      <Image
        className={builderStyles.buttonImage}
        src={props.src}
        width={200}
        height={200}
        style={activeStyle}
        alt="props.data.name"
      />
    </div>
  );
}
