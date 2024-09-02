import React, {
  DragEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import Image from 'next/image';

//type interfaces
// import Activity from '../interfaces/Activity';
// import ImageEl from '../interfaces/ImageEl';
// import ImageRef from '../interfaces/ImageRef';

//components
import ImageC from './ImageC';
import ImageController from './ImageController';
import DataContext from './DataContext';

interface CanvasProps {
  viewScale: number;
}

export default function Canvas(props: CanvasProps) {
  // const [dataLoaded, setDataLoaded] = useState(data ? true : false);

  const [images, setImages] = useState<string[]>([]);

  const { data } = useContext(DataContext);

  console.log('canvas render');

  // useEffect(() => {
  //   console.log('canvas effect');
  //   if (data) {
  //     setDataLoaded(true);
  //   }
  //   return () => {};
  // }, [data]);

  return (
    <>{data && <ImageController viewScale={props.viewScale} />}</>
  );
}
