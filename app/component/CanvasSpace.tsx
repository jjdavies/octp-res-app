import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import builderStyles from '../styles/Builder.module.css';
import Canvas from './Canvas';
import DataContext from './DataContext';
import StagesPane from './StagesPane';

interface CanvasSpaceProps {
  viewScale: number;
  changeViewScale: Function;
  canvasRectCB: Function;
}

export default function CanvasSpace(props: CanvasSpaceProps) {
  console.log('canvas space render');

  const upHandler = () => {
    props.changeViewScale(1.1);
  };

  const downHandler = () => {
    props.changeViewScale(0.9);
  };

  const { resetSelections, actionsPaneActive, stagesPaneActive } =
    useContext(DataContext);

  useEffect(() => {
    const canvasSpace: HTMLElement | null =
      document.getElementById('canvasSpace');
    let canvasRect: DOMRect;
    if (canvasSpace != null) {
      canvasRect = canvasSpace.getBoundingClientRect();
      props.canvasRectCB(canvasRect);
    }
  }, []);

  const canvasClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    const { target } = e;
    const targetID = (target as HTMLDivElement).id;
    if (targetID === 'canvasSpace' || targetID === 'linesCanvas') {
      resetSelections();
    }
  };

  const setSelectedImage = (id: string) => {
    // props.setSelectedImage(id);
  };

  return (
    <>
      <ReactScrollWheelHandler
        upHandler={upHandler}
        downHandler={downHandler}
        timeout={0}
        disableSwipeWithMouse
      >
        <div
          id="canvasSpace"
          className={builderStyles.canvasSpace}
          style={{ width: '100%' }}
          onClick={canvasClick}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                width: '100px',
              }}
            >
              Zoom: {Math.floor(props.viewScale)}%
            </div>
          </div>
          <div
            id="canvasSpace"
            className={builderStyles.canvas}
            style={{
              width: `${1920 * (props.viewScale / 100)}px`,
              height: `${1080 * (props.viewScale / 100)}px`,
            }}
          >
            <Canvas viewScale={props.viewScale} />
          </div>
        </div>
      </ReactScrollWheelHandler>
      {stagesPaneActive && <StagesPane />}
    </>
  );
}
