import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import builderStyles from '../styles/Builder.module.css';
import ActivityStage from '../interfaces/ActivityStage';
import DataContext from './DataContext';

interface StageThumbProps {
  stage: ActivityStage;
  stageDown: Function;
}

export default function StageThumb(props: StageThumbProps) {
  const { setStage, currentStageID, reOrderStages } =
    useContext(DataContext);
  const [dragging, setDragging] = useState<boolean>(false);
  const [originalPos, setOriginalPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const stageClick = () => {
    setStage(props.stage.stageID);
  };
  const stageDown = (e, ui) => {
    setOriginalPos({ x: ui.x, y: ui.y });
    setDragging(true);
  };
  const stageUp = () => {
    setDragging(false);
    setCurrentPos({ x: originalPos.x, y: originalPos.y });
  };
  const stageDrag = (e, ui) => {
    console.log({
      x: originalPos.x + ui.deltaX,
      y: currentPos.y + ui.deltaY,
    });
    setCurrentPos({
      x: currentPos.x + ui.deltaX,
      y: currentPos.y + ui.deltaY,
    });
    if (currentPos.y - originalPos.y > 150) {
      reOrderStages(props.stage.stageID, 1);
      setCurrentPos({ x: currentPos.x, y: currentPos.y - 150 });
    }
    if (currentPos.y - originalPos.y < -150) {
      reOrderStages(props.stage.stageID, -1);
      setCurrentPos({ x: currentPos.x, y: currentPos.y + 150 });
    }
  };
  return (
    <div>
      <Draggable
        axis={'y'}
        onStart={stageDown}
        onStop={stageUp}
        onDrag={stageDrag}
        position={currentPos}
      >
        <div
          className={builderStyles.stageThumb}
          onClick={stageClick}
          style={{
            border:
              currentStageID === props.stage.stageID
                ? 'solid 3px darkblue'
                : '',
            zIndex: dragging ? 25 : 1,
            position: dragging ? 'relative' : 'relative',
          }}
        >
          {props.stage.thumb && (
            <Image
              src={props.stage.thumb}
              width={263}
              height={147}
              draggable={false}
              alt="stage thumb"
            />
          )}
        </div>
      </Draggable>
    </div>
  );
}
