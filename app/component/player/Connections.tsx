import path from 'path';
import React, { useContext, useEffect } from 'react';
import DataContext from './DataContext';

import MatchAttempt from '../../interfaces/MatchAttempt';

export default function Connections() {
  const lineColors = ['red', 'blue', 'green', 'purple'];
  const { matchAttempts, data, currentStageID } =
    useContext(DataContext);

  useEffect(() => {
    const canvas = document.getElementById('linesCanvas');
    let ctx: any;
    if (canvas) ctx = (canvas as HTMLCanvasElement).getContext('2d');
    ctx?.clearRect(0, 0, 1920, 1080);
    ctx?.setLineDash([]);
    matchAttempts.map((ma, index) => {
      console.log(ma);
      const path = new Path2D();
      const resourceA = data?.stages
        .filter((stg) => stg.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === ma.a
        )[0];
      const resourceB = data?.stages
        .filter((stg) => stg.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === ma.b
        )[0];

      if (ctx) {
        const resAX =
          +resourceA.resourceSettings.startPosition.split(',')[0];
        const resAY =
          +resourceA.resourceSettings.startPosition.split(',')[1];
        const resAW = +resourceA?.style.width;
        const resAH = +resourceA?.style.height;
        const resBX =
          +resourceB.resourceSettings.startPosition.split(',')[0];
        const resBY =
          +resourceB.resourceSettings.startPosition.split(',')[1];
        const resBW = +resourceB?.style.width;
        const resBH = +resourceB?.style.height;

        if (
          (index - (index % lineColors.length)) / lineColors.length >
          0
        ) {
          // ctx.setLineDash([15, 5]);
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
        // ctx.moveTo(resAX + resAW / 2, resAY + 50 + resAH / 2);
        // ctx.lineTo(resBX + resBW / 2, resBY + resBH / 2);
        let lineEndPosX = resAX + resAW / 2;
        let lineEndPosY = resAY + 50 + resAH / 2;
        const targetX = resBX + resBW / 2;
        const targetY = resBY + resBH / 2;
        const diffX = Math.abs(lineEndPosX - targetX);
        const diffY = Math.abs(lineEndPosY - targetY);
        for (var i = 0; i < 10; i++) {
          let incr = getRandom(15, 20);
          const relIncr = (targetX - lineEndPosX) / incr;
          let yIncr = (targetY - lineEndPosY) / relIncr;
          // let xDeviation = getRandom(-9, 9);
          let yDeviation = getRandom(-9, 9);
          const midX = lineEndPosX + incr / 2;
          const midY = lineEndPosY + (yIncr + yDeviation) / 2;
          lineEndPosX += incr;
          lineEndPosY += yIncr + yDeviation;
          // ctx.lineTo(lineEndPosX, lineEndPosY);
          ctx.quadraticCurveTo(lineEndPosX, lineEndPosY, midX, midY);
          ctx.stroke();
        }
        // while (
        //   Math.abs(lineEndPosX - targetX) > 10 ||
        //   Math.abs(lineEndPosY - targetY) > 10
        // ) {
        //   let incr = getRandom(15, 20);
        //   const relIncr = (targetX - lineEndPosX) / incr;
        //   let yIncr = (targetY - lineEndPosY) / relIncr;
        //   // let xDeviation = getRandom(-9, 9);
        //   let yDeviation = getRandom(-9, 9);
        //   const midX = lineEndPosX + incr / 2;
        //   const midY = lineEndPosY + (yIncr + yDeviation) / 2;
        //   lineEndPosX += incr;
        //   lineEndPosY += yIncr + yDeviation;
        //   // ctx.lineTo(lineEndPosX, lineEndPosY);
        //   ctx.quadraticCurveTo(lineEndPosX, lineEndPosY, midX, midY);
        //   ctx.stroke();
        // }
      }
    });
  }, [matchAttempts]);

  const getRandom = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  return (
    <div>
      {matchAttempts.length > 0 && (
        <canvas
          id="linesCanvas"
          width="1920"
          height="1080"
          style={{
            position: 'absolute',
            left: 0,
            width: `${1920}px`,
            height: `${1080}px`,
            zIndex: 2,
          }}
        ></canvas>
      )}
    </div>
  );
}
