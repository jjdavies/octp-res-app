import React, { useContext, useState } from 'react';
import Image from 'next/image';
import builderStyles from '../styles/Builder.module.css';

import AddAction from '../../img/buttons/add.svg';
import NavArrowActive from '../../img/buttons/navArrowActive.svg';
import DataContext from './DataContext';
import Draggable from 'react-draggable';
import StageThumb from './StageThumb';

export default function StagesPane() {
  const { data } = useContext(DataContext);
  const [draggingStage, setDraggingStage] = useState<string>('');

  const stageDown = (stageID: string) => {
    setDraggingStage(stageID);
  };

  const stageUp = () => {
    setDraggingStage('');
  };

  return (
    <div className={builderStyles.rightPaneModal}>
      {data && data?.stages.length > 0 && (
        <>
          {data?.stages.map((stage, index) => (
            <StageThumb
              key={stage.stageID}
              stage={stage}
              stageDown={stageDown}
            />
          ))}
        </>
      )}
    </div>
  );
}
