import React, { useContext } from 'react';
import Image from 'next/image';
import ActivityResource from '../interfaces/ActivityResource';
import DataContext from './player/DataContext';
import MatchAttempt from '../interfaces/MatchAttempt';

import builderStyles from '../styles/Builder.module.css';

import tick from '../img/icons/tick.png';
import cross from '../img/icons/cross.png';

interface AnswerSymbolProps {
  attempt: MatchAttempt;
}

export default function AnswerSymbol(props: AnswerSymbolProps) {
  const { data, matchAttempts, currentStageID } =
    useContext(DataContext);
  const attempt = props.attempt;
  const aPartResource = data?.stages
    .filter((stg) => stg.stageID === currentStageID)[0]
    .activitySettings.resources.filter(
      (res) => res.resourceID === attempt.a
    )[0];
  const bPartResource: ActivityResource | undefined = data?.stages
    .filter((stg) => stg.stageID === currentStageID)[0]
    .activitySettings.resources.filter(
      (res) => res.resourceID === attempt.b
    )[0];
  const aX = aPartResource
    ? +aPartResource?.resourceSettings.startPosition.split(',')[0] +
      aPartResource.style.width
    : 0;
  const aY = aPartResource
    ? +aPartResource?.resourceSettings.startPosition.split(',')[1] +
      aPartResource?.style.height / 2
    : 0;
  const bX = bPartResource
    ? +bPartResource?.resourceSettings.startPosition.split(',')[0]
    : 0;
  const bY = bPartResource
    ? +bPartResource?.resourceSettings.startPosition.split(',')[1] +
      bPartResource?.style.height / 2 -
      50
    : 0;

  const conflicts = matchAttempts.filter((match) => {
    if (match.b === attempt.b) return true;
    return false;
  });
  let positionX = bX;
  let positionY = bY;
  if (conflicts.length > 1) {
    //there is a conflict on part b (more than one line connected)
    //push answer symbol back along the line
    //
    //distance between a + b
    let ab = Math.sqrt((bX - aX) * (bX - aX) + (bY - aY) * (bY - aY));
    //move towards a
    positionX = bX + (aX - bX) * 0.3;
    positionY = bY + (aY - bY) * 0.3;
  }
  let matchResult = false;
  const matchingConnection = data?.stages
    .filter((stg) => stg.stageID === currentStageID)[0]
    .connections.map((conn) => {
      if (conn.a === attempt.a && conn.b === attempt.b) {
        matchResult = true;
      }
      if (conn.b === attempt.a && conn.a === attempt.b) {
        matchResult = true;
      }
    });

  const style = {
    left: positionX,
    top: positionY,
  };

  return (
    <div className={builderStyles.answerSymbol} style={style}>
      <Image
        src={matchResult ? tick : cross}
        width={100}
        alt="answer symbol"
      />
    </div>
  );
}
