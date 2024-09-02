import React, {
  CSSProperties,
  DetailedHTMLProps,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import CanvasClip from './CanvasClip';

import builderStyles from '../styles/Builder.module.css';
import ContentResource from '../interfaces/ContentResource';

interface ImageCProps {
  id: string;
  viewScale: number;
  contentResource: ContentResource;
  width: number;
  height: number;
  x: number;
  y: number;
  zOrder: number;
  locked: boolean;
  // connectionNode: string;
  draggable: boolean;
}

export default function TargetC(props: ImageCProps) {
  const id = props.id;
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

  useEffect(() => {
    setViewScale(props.viewScale);
  }, [props.viewScale]);

  useEffect(() => {
    console.log('new props x and y', props.x, props.y);
    setPos({ x: props.x, y: props.y });
    setWidth(props.width);
    setHeight(props.height);
  }, [props.x, props.y]);

  const divStyle: CSSProperties = {
    width: width * (props.viewScale / 100),
    height: height * (props.viewScale / 100),
    margin: '0',
    filter: 'hue-rotate(180deg)',
    zIndex: props.zOrder,
    left: pos.x * (viewScale / 100),
    top: pos.y * (viewScale / 100),
    pointerEvents: 'none',
  };

  return (
    <>
      <div style={{ ...divStyle, position: 'absolute' }}>
        <div style={{ position: 'absolute' }}>
          {/* {props.id}, {props.zOrder}, {offsetX} */}
        </div>

        {/* {resourceType === 'audio' && (
          <CanvasClip
            src={src}
            format={props.contentResource.format}
            clickHandler={(e: React.MouseEvent<Element, MouseEvent>) => {
              props.clickHandler(e, id);
            }}
          />
        )} */}
        {resourceType === 'image' && (
          <>
            <Image
              id="imageSpace"
              src={src}
              width={width * (props.viewScale / 100)}
              height={height * (props.viewScale / 100)}
              alt=""
              draggable={false}
            />
          </>
        )}
      </div>
    </>
  );
}
