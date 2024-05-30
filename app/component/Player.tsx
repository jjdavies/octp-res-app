import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Activity from '../interfaces/NewActivity';
import Resource from './Resource';
import DataContext from './player/DataContext';

import builderStyles from '../styles/Builder.module.css';
import Connections from './player/Connections';
import GameControl from './GameControl';
import Generator from './Generator';

import navRight from '../img/buttons/navArrow.svg';
import navRightActive from '../img/buttons/navArrowActive.svg';
// import html2canvas from 'html2canvas';

interface PlayerProps {
  name: string;
  data: Activity;
}

export default function Player(props: PlayerProps) {
  const [navRightHover, setNavRightHover] = useState<boolean>(false);

  const {
    data,
    setInitialData,
    matchAttempts,
    currentStageID,
    navigateRight,
  } = useContext(DataContext);
  console.log(props.data);
  console.log(
    'player',
    data?.stages.filter((stg) => stg.stageID === currentStageID)[0]
  );
  console.log(
    'player',
    data?.stages.filter((stg) => stg.stageID === currentStageID)[0]
      .activitySettings.resources
  );
  useEffect(() => {
    setInitialData(props.data);
  }, [props.data]);

  const navEnter = () => {
    setNavRightHover(true);
  };

  const navLeave = () => {
    setNavRightHover(false);
  };

  const touchNavigateRight = () => {
    console.log('touch nav');
  };

  // const getNewThumb = async (): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     html2canvas(
  //       document.getElementById('playerContainer') as HTMLElement
  //     ).then((canvas) => {
  //       resolve(canvas.toDataURL('image/png'));
  //     });
  //   });
  // };

  const generateThumb = async () => {
    // const thumb = await getNewThumb();

    const element = document.createElement('a');
    element.href = thumb;
    element.download = `${props.name}.png`;
    element.click();
  };

  return (
    <div
      id="playerContainer"
      className={builderStyles.playerContainer}
    >
      <div className={builderStyles.player}>
        <Connections />
        {data &&
          data.stages
            .filter((stage) => stage.stageID === currentStageID)[0]
            .activitySettings.resources.map((res) =>
              res.resourceSettings.special === 'generator-static' ? (
                <Generator key={res.resourceID} resourceData={res} />
              ) : res.resourceSettings.draggable ? (
                <Resource key={res.resourceID} resourceData={res} />
              ) : (
                <Resource
                  key={res.resourceID}
                  resourceData={res}
                  static
                />
                // <Resource key={res.resourceID} resourceData={res} />
              )
            )}
        {matchAttempts.length > 0 && <GameControl match />}
        <div className={builderStyles.navRight}>
          <Image
            src={navRightHover ? navRightActive : navRight}
            onMouseEnter={navEnter}
            onMouseOut={navLeave}
            onClick={navigateRight}
            onTouchEnd={navigateRight}
            alt="nav right arrow"
          />
        </div>
      </div>
    </div>
  );
}
