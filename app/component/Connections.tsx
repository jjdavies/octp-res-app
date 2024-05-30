import React, { useContext, useEffect } from 'react';

import Activity from '../interfaces/Activity';
import ActivityStage from '../interfaces/ActivityStage';
import DataContext from './DataContext';

interface ConnectionsProps {
  data: ActivityStage;
  viewScale: number;
}

export default function Connections(props: ConnectionsProps) {
  const lineColors = ['red', 'blue', 'green', 'purple'];
  const { settingConnectionActive } = useContext(DataContext);
  const canvas = document.getElementById('linesCanvas');
  let ctx;
  if (canvas) ctx = (canvas as HTMLCanvasElement).getContext('2d');
  ctx?.clearRect(0, 0, 1920, 1080);
  ctx?.setLineDash([]);

  useEffect(() => {
    const canvas = document.getElementById('linesCanvas');
    let ctx: CanvasRenderingContext2D | null;
    if (canvas) ctx = (canvas as HTMLCanvasElement).getContext('2d');
    props.data.connections.map((connection, index) => {
      const resourceA = props.data.activitySettings.resources.filter(
        (res) => res.resourceID === connection.a
      )[0];
      const resourceB = props.data.activitySettings.resources.filter(
        (res) => res.resourceID === connection.b
      )[0];
      if (ctx) {
        console.log('CONTEXT');
        const resAX =
          +resourceA.resourceSettings.startPosition.split(',')[0];
        const resAY =
          +resourceA.resourceSettings.startPosition.split(',')[1];
        const resBX =
          +resourceB.resourceSettings.startPosition.split(',')[0];
        const resBY =
          +resourceB.resourceSettings.startPosition.split(',')[1];
        console.log(
          (index - (index % lineColors.length)) / lineColors.length
        );
        if (
          (index - (index % lineColors.length)) / lineColors.length >
          0
        ) {
          ctx.setLineDash([15, 5]);
        }
        if (
          (index - (index % lineColors.length)) / lineColors.length >
          1
        ) {
          ctx.setLineDash([5, 10]);
        }
        ctx.strokeStyle = lineColors[index % lineColors.length];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(resAX + 50, resAY + 50);
        ctx.lineTo(resBX + 50, resBY + 50);
        ctx.stroke();
      }
    });
  }, [props, settingConnectionActive]);

  return (
    <div>
      {/* <p>{settingConnectionActive ? 'true' : 'false'}</p> */}
      {settingConnectionActive && (
        <canvas
          id="linesCanvas"
          width="1920"
          height="1080"
          style={{
            position: 'absolute',
            width: `${1920 * (props.viewScale / 100)}px`,
            height: `${1080 * (props.viewScale / 100)}px`,
          }}
        ></canvas>
      )}
    </div>
  );
}
