import React, {
  DetailedHTMLProps,
  useContext,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import CanvasClip from './CanvasClip';

import builderStyles from '../styles/Builder.module.css';
import ContentResource from '../interfaces/ContentResource';

import DraggerIcon from '../img/buttons/setDraggersActive.svg';
import CorrectIcon from '../img/buttons/assignCorrect.svg';
import IncorrectIcon from '../img/buttons/assignIncorrect.svg';
import DataContext from './DataContext';

interface ImageCProps {
  id: string;
  viewScale: number;
  contentResource: ContentResource;
  width: number;
  height: number;
  x: number;
  y: number;
  zOrder: number;
  updateData: Function;
  clickHandler: Function;
  selected: string;
  locked: boolean;
  connectionNode: string;
  draggable: boolean;
  settingDraggersActive: boolean;
  settingDropPositionActive: boolean;
  settingCorrect: boolean;
  settingIncorrect: boolean;
  multichoice: string;
}

export default function ImageC(props: ImageCProps) {
  // const { settingActionTriggerResource } = useContext(DataContext);
  const id = props.id;
  const selected = props.selected;
  const [viewScale, setViewScale] = useState(props.viewScale);

  const [pos, setPos] = useState({ x: props.x, y: props.y });
  const [resizePos, setResizePos] = useState({
    x: 0,
    y: 0,
  });
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);
  const src = props.contentResource.base64
    ? props.contentResource.base64
    : props.contentResource.localURL
    ? props.contentResource.localURL
    : '';

  let resourceType = 'unknown';
  // console.log('IMAGEC RENDER ', id);
  switch (props.contentResource.format) {
    case 'image':
      resourceType = 'image';
      break;
    case 'wav':
    case 'mpeg':
    case 'mp3':
      resourceType = 'audio';
      break;
  }

  const dragBegin: DraggableEventHandler = () => {
    // console.log(defaultX);
  };

  const dragStop: DraggableEventHandler = (e, ui) => {
    // props.updateData(pos, width, height);
    updateData();
    if (props.settingDropPositionActive)
      setPos({ x: props.x, y: props.y });
  };
  const dragging: DraggableEventHandler = (e, ui) => {
    var xDiff = ui.x * ((1 / props.viewScale) * 100) - props.x;
    var newX = props.x + xDiff;
    var yDiff = ui.y * ((1 / props.viewScale) * 100) - props.y;
    var newY = props.y + yDiff;
    setPos({ x: newX, y: newY });
  };

  const resizeDrag: DraggableEventHandler = (e, ui) => {
    const xChange =
      ui.x -
      (pos.x * (viewScale / 100) + width * (props.viewScale / 100));
    const yChange =
      ui.y - height * (viewScale / 100) - pos.y * (viewScale / 100);
    // ui.y - (pos.y * (viewScale / 100) - height * (viewScale / 100));
    console.log(yChange);
    const relX = xChange / width;
    const relY = yChange / height;
    const change = Math.abs(relX) > Math.abs(relY) ? relX : relY;
    // console.log(change);
    if (change < 0 && (width < 25 || height < 25)) {
      return;
    }
    console.log(resourceType);
    if (resourceType === 'audio') {
      setWidth(width + xChange);
      setHeight(height + yChange);
    }
    if (resourceType === 'image') {
      setWidth(width - -change * width);
      setHeight(height - -change * height);
    }
  };

  useEffect(() => {
    setViewScale(props.viewScale);
  }, [props.viewScale]);

  const updateData = () => {
    if (!props.settingDraggersActive)
      props.updateData(id, pos, width, height);
  };

  let border = id === selected ? '2px dashed black' : '';
  let offsetX = id === selected ? -2 : 0;
  let offsetY = id === selected ? -2 : 0;
  if (props.connectionNode === id) {
    border = '4px dotted black';
    offsetX = -4;
    offsetY = -4;
  }
  // if (settingActionTriggerResource) {
  //   border = '4px dotted blue';
  //   offsetX = -4;
  //   offsetY = -4;
  // }

  const divStyle = {
    width: width * (props.viewScale / 100),
    height: height * (props.viewScale / 100),
    margin: '0',
    border: border,
    zIndex: props.zOrder,
  };

  return (
    <>
      <Draggable
        onStart={dragBegin}
        onStop={dragStop}
        onDrag={dragging}
        bounds="#canvasSpace"
        position={{
          x: pos.x * (viewScale / 100),
          y: pos.y * (viewScale / 100),
        }}
        disabled={props.locked}
      >
        <div style={{ ...divStyle, position: 'absolute' }}>
          <div style={{ position: 'absolute' }}>
            {/* {props.id}, {props.zOrder}, {offsetX} */}
          </div>

          {resourceType === 'audio' && (
            <CanvasClip
              src={src}
              format={props.contentResource.format}
              clickHandler={(
                e: React.MouseEvent<Element, MouseEvent>
              ) => {
                props.clickHandler(e, id);
              }}
              width={0}
              height={0}
            />
          )}
          {resourceType === 'image' && (
            <>
              <Image
                id="imageSpace"
                src={src}
                onClick={(e) => props.clickHandler(e, id)}
                width={width * (props.viewScale / 100)}
                height={height * (props.viewScale / 100)}
                alt=""
                draggable={false}
                style={{}}
              />
            </>
          )}
        </div>
      </Draggable>
      {props.settingDraggersActive && props.draggable && (
        <Image
          style={{
            position: 'absolute',
            left: pos.x * (viewScale / 100) + resizePos.x,
            top: pos.y * (viewScale / 100) + resizePos.y,
            transform: 'scale(.5)',
            zIndex: props.zOrder,
          }}
          src={DraggerIcon}
          alt="draggable icon"
          draggable={false}
        />
      )}
      {(props.settingCorrect || props.settingIncorrect) &&
        props.multichoice === 'correct' && (
          <Image
            style={{
              position: 'absolute',
              left: pos.x * (viewScale / 100) + resizePos.x,
              top: pos.y * (viewScale / 100) + resizePos.y,
              transform: 'scale(.25)',
              zIndex: props.zOrder,
            }}
            src={CorrectIcon}
            alt="correct icon"
            draggable={false}
          />
        )}
      {(props.settingCorrect || props.settingIncorrect) &&
        props.multichoice === 'incorrect' && (
          <Image
            style={{
              position: 'absolute',
              left: pos.x * (viewScale / 100) + resizePos.x,
              top: pos.y * (viewScale / 100) + resizePos.y,
              transform: 'scale(.25)',
              zIndex: props.zOrder,
            }}
            src={IncorrectIcon}
            alt="incorrect icon"
            draggable={false}
          />
        )}
      <Draggable
        position={{
          x:
            pos.x * (viewScale / 100) +
            width * (props.viewScale / 100) +
            resizePos.x,
          y:
            pos.y * (viewScale / 100) +
            resizePos.y +
            height * (viewScale / 100),
        }}
        onDrag={resizeDrag}
        onStop={updateData}
        bounds={{
          top: -height * (props.viewScale / 100),
          left: -width * (props.viewScale / 100),
        }}
        disabled={props.locked}
      >
        <div
          id="sizeToggle"
          className={builderStyles.sizeToggle}
          style={{ zIndex: props.zOrder }}
        ></div>
      </Draggable>
    </>
  );
}
