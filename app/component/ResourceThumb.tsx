import React, { useContext } from 'react';
import DataContext from './DataContext';
import Image from 'next/image';
import ActivityResource from '../interfaces/ActivityResource';
import Trigger from '../interfaces/actionSystem/Trigger';

interface ResourceThumbProps {
  res: ActivityResource;
  onClick: Function;
  selectedResource: string;
  trigger?: Trigger;
  selectedTriggerEvent?: string;
  caption?: string;
}

export default function ResourceThumb(props: ResourceThumbProps) {
  const { data } = useContext(DataContext);
  const content = data?.resources.imagesContents.filter(
    (res) => res.contentID === props.res.contentRefID
  )[0];
  const src =
    content && content.base64 ? content.base64 : content?.localURL;
  // const highlight = false;
  const highlightTrigger =
    props.selectedTriggerEvent &&
    props.selectedTriggerEvent === props.trigger?.id;
  const highlightResource =
    props.selectedResource &&
    props.selectedResource === props.res.resourceID;

  const highlight = props.caption
    ? highlightTrigger
    : highlightResource;

  const clickHandler = () => {
    props.onClick({
      res: props.res,
      caption: props.caption ? props.caption : null,
      trigger: props.trigger ? props.trigger : null,
    });
  };
  return (
    <div onClick={clickHandler}>
      {src && (
        <>
          <Image
            style={{
              border: highlight ? '6px solid lightgreen' : 0,
            }}
            src={src}
            width={100}
            height={100}
            alt="res thumb"
          />
          {props.caption && (
            <div
              style={{
                background: 'rgba(255,255,255,.3)',
                width: '100px',
                height: '100px',
                position: 'relative',
                top: '-100px',
                textAlign: 'center',
                color: 'black',
                fontSize: '25px',
                fontWeight: 'bold',
                // filters: 'drop-shadow(2px 2px 2px black)',
              }}
            >
              [Trigger]
              <br />
              {props.caption}
            </div>
          )}
        </>
      )}
    </div>
  );
}
