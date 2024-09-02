'use client';
import React, { useEffect, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import Image from 'next/image';
import Link from 'next/link';
import {
  SkeletonJson,
  SpinePlayer,
} from '@esotericsoftware/spine-player';
import sceneStyles from './Scene.module.css';
import useSound from 'use-sound';
import Gatekeeper from './staticworkers/gatekeeper.png';
import Gymteacher from './staticworkers/gymteacher.png';
import Busdriver from './staticworkers/busdriver_1.png';
import Englishteacher from './staticworkers/englishteacher_1.png';
import Musicteacher from './staticworkers/musicteacher.png';
import Principal from './staticworkers/principal.png';
import Secretary from './staticworkers/secretary.png';
import Janitor from './staticworkers/janitor.png';

// import ResetButton from '../../img/buttons/resetbutton.png';
import NavArrow from '../../img/buttons/navArrow.svg';

const init = () => {
  const playerWidth = 1030;
  const playerHeight = 579;

  return new SpinePlayer('container', {
    jsonUrl: '/scenes/bf3school/bf3school.json',
    atlasUrl: '/scenes/bf3school/bf3school.atlas',
    animation: 'idle',
    premultipliedAlpha: true,
    // backgroundColor: '#282c34',
    alpha: true,
    backgroundColor: '#00000000',
    viewport: {
      x: -playerWidth / 2,
      y: -playerHeight / 2,
      width: playerWidth,
      height: playerHeight,
      padLeft: 0,
      padRight: 0,
      padTop: 0,
      padBottom: 0,
      debugRender: false,
    },
    showControls: false,

    success: (player) => {
      var animationState = player.animationState;
      var zoomtogate = animationState?.setAnimation(
        50,
        'arriveatschool/zoomtogate',
        false
      );
      var principaltype1 = animationState?.setAnimation(
        9,
        'principaltyping1',
        true
      );
      var principaltype2 = animationState?.setAnimation(
        10,
        'principaltyping2',
        true
      );
      var secretary = animationState?.setAnimation(
        11,
        'secretary',
        true
      );
      var kidsplaying = animationState?.setAnimation(
        12,
        'kidsplaying',
        true
      );
      kidsplaying.timeScale = 0.5;
      var gatekeeper = animationState.setAnimation(
        13,
        'gatekeeper',
        true
      );
      var gymteacher = animationState?.setAnimation(
        14,
        'gymteacher',
        true
      );
      var janitor = animationState?.setAnimation(15, 'janitor', true);

      //stop the bus
      animationState?.addAnimation(38, 'absent/stopbus', false);
    },

    frame: (player) => {
      var animationState = player.animationState;
      var sceneContainer = document.getElementById('sceneContainer');
      var leftPane = document.getElementById('leftPane');
    },
  });
};

// eslint-disable-next-line react/display-name
const BF3School = React.memo(() => {
  const [soundsStarted, setSoundsStarted] = useState(false);

  const [schoolSound, schoolsound] = useSound(
    '/sounds/schoolambience.mp3',
    { volume: 0.6 }
  );
  const [pianoSound, pianosound] = useSound('/sounds/piano.mp3', {
    loop: true,
  });
  const [officeSound, officesound] = useSound('/sounds/office.mp3', {
    loop: true,
  });
  const [playgroundSound, playgroundsound] = useSound(
    '/sounds/playground.mp3',
    {
      loop: true,
    }
  );
  const [classroomSound, classroomsound] = useSound(
    '/sounds/classroom.mp3',
    {
      loop: true,
    }
  );
  const [fairyDustSound, fairydustsound] = useSound(
    '/sounds/fairydust.mp3'
  );

  const [workers, setWorkers] = useState([
    {
      name: 'englishteacher',
      posX: 0,
      posY: 0,
      src: Englishteacher,
      targetX: 840,
      altTargetX: 880,
      targetY: 157,
      altTargetY: 295,
      targetPlace: 'english',
    },
    {
      name: 'musicteacher',
      posX: 0,
      posY: 0,
      src: Musicteacher,
      targetX: 260,
      altTargetX: 290,
      targetY: 165,
      altTargetY: 320,
      targetPlace: 'music',
    },
    {
      name: 'busdriver',
      posX: 0,
      posY: 0,
      src: Busdriver,
      targetX: 92,
      altTargetX: 300,
      targetY: 475,
      altTargetY: 350,
      targetPlace: 'none',
    },
    {
      name: 'principal',
      posX: 0,
      posY: 0,
      src: Principal,
      targetX: 225,
      altTargetX: 275,
      targetY: 320,
      altTargetY: 285,
      targetPlace: 'office',
    },
    {
      name: 'secretary',
      posX: 0,
      posY: 0,
      src: Secretary,
      targetX: 370,
      altTargetX: 645,
      targetY: 330,
      altTargetY: 295,
      width: 50,
      targetPlace: 'office',
    },
    {
      name: 'gymteacher',
      posX: 0,
      posY: 0,
      src: Gymteacher,
      targetX: 550,
      altTargetX: 395,
      targetY: 400,
      altTargetY: 275,
      targetPlace: 'gym',
    },
    {
      name: 'janitor',
      posX: 0,
      posY: 0,
      src: Janitor,
      targetX: 825,
      altTargetX: 650,
      targetY: 435,
      altTargetY: 330,
      targetPlace: 'none',
    },
    {
      name: 'gatekeeper',
      posX: 0,
      posY: 0,
      src: Gatekeeper,
      targetX: 480,
      altTargetX: 565,
      targetY: 505,
      altTargetY: 385,
      targetPlace: 'gate',
    },
  ]);

  const [workersPresent, setWorkersPresent] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [resetAllWorkers, setResetAllWorkers] =
    useState(false);

  useEffect(() => {
    var player = init();
    setTimeout(() => {
      // setUpWorkerTargets();
    }, 5000);
    setUpWorkerTargets();
    return () => {
      player.dispose();
    };
  }, []);

  const setUpWorkerTargets = () => {
    const player = document.getElementById('sceneoverlay');
    const playerRect = player?.getBoundingClientRect();
    console.log(playerRect);
    const playerX = playerRect.x;
    const playerY = playerRect.y;
    const playerWidth = playerRect.width;
    const playerHeight = playerRect.height;
    const musicTeacherPlace = [502, 238];
    setWorkers(
      workers.map((wrkr) => {
        return {
          ...wrkr,
          targetX: playerX + wrkr.targetX,
          targetY: playerY + wrkr.targetY,
          altTargetX: playerX + wrkr.altTargetX,
          altTargetY: playerY + wrkr.altTargetY,
        };
      })
    );
  };

  const handleWorkerStop = (e) => {
    let placed = false;
    const worker = workers.filter(
      (wrkr) => wrkr.name === e.target.id
    )[0];
    let targetX = worker.targetX;
    let targetY = worker.targetY;
    if (zoomStatus.substring(0, 3) !== 'out') {
      if (worker.targetPlace !== zoomStatus) return;
      targetX = worker.altTargetX;
      targetY = worker.altTargetY;
    }

    const diffX = Math.abs(targetX - e.x);
    const diffY = Math.abs(targetY - e.y);
    console.log(e.x, e.y);
    if (diffX < 60 && diffY < 40) placed = true;

    if (!placed) return;

    setWorkersPresent(
      workersPresent.map((wrkr, workerIndex) => {
        return workerIndex === workers.indexOf(worker) ? false : wrkr;
      })
    );
    if (worker.name === 'englishteacher') {
      console.log(worker.name);
      setEnglishTeacherPlaced(true);
      setTimeout(() => {
        setEnglishTeacherPlaced(false);
      }, 50);
    }
    if (worker.name === 'musicteacher') {
      setMusicTeacherPlaced(true);
      setTimeout(() => {
        setMusicTeacherPlaced(false);
      }, 50);
    }
    if (worker.name === 'gymteacher') {
      setGymTeacherPlaced(true);
      setTimeout(() => {
        setGymTeacherPlaced(false);
      }, 50);
    }
    if (worker.name === 'principal') {
      setPrincipalPlaced(true);
      setTimeout(() => {
        setPrincipalPlaced(false);
      }, 50);
    }
    if (worker.name === 'secretary') {
      setSecretaryPlaced(true);
      setTimeout(() => {
        setSecretaryPlaced(false);
      }, 50);
    }
    if (worker.name === 'janitor') {
      setJanitorPlaced(true);
      setTimeout(() => {
        setJanitorPlaced(false);
      }, 50);
    }
    if (worker.name === 'busdriver') {
      setBusDriverPlaced(true);
      setTimeout(() => {
        setBusDriverPlaced(false);
      }, 50);
    }
    if (worker.name === 'gatekeeper') {
      setGatekeeperPlaced(true);
      setTimeout(() => {
        setGatekeeperPlaced(false);
      }, 50);
    }
    fairyDustSound();
  };

  const resetWorkers = () => {
    setWorkersPresent([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
    setResetAllWorkers(true);
    setTimeout(() => {
      setResetAllWorkers(false);
    }, 50);
  };

  const stopAllSounds = () => {
    schoolsound.sound.stop();
    classroomsound.sound.stop();
    playgroundsound.sound.stop();
    pianosound.sound.stop();
    officesound.sound.stop();
  };

  return (
    <div
      id={'sceneContainer'}
      className={sceneStyles.sceneContainer}
      style={{ background: 'lightblue' }}
    >
      <Link href="/scene">
        <Image
          src={NavArrow}
          width={100}
          height={100}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(180deg)',
          }}
          alt="nav arrow to go back"
          onClick={stopAllSounds}
        />
      </Link>
      <div
        id="container"
        style={{
          maxWidth: '1030px',
          aspectRatio: '16/9',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          id="sceneoverlay"
          className={sceneStyles.canvasOverlay}
        ></div>
        <div
          style={{
            position: 'absolute',
            zIndex: 200,
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          <div
            id="leftPane"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              background: 'lightblue',
              height: 579 + 'px',
              width: '300px',
              pointerEvents: 'auto',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
            data-resetWorkers={resetAllWorkers}
          >
            {/* {workers.map((worker, index) => (
                <DraggableWorker
                  key={worker.name}
                  worker={worker}
                  index={index}
                  onStop={handleWorkerStop}
                  workersPresent={workersPresent}
                />
              ))} */}
          </div>
          <div
            style={{ width: '1030px', pointerEvents: 'none' }}
          ></div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              background: 'lightblue',
              height: 579 + 'px',
              width: '300px',
              pointerEvents: 'auto',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            {/* <div
                className={sceneStyles.resetButton}
                onClick={resetWorkers}
              >
                <Image
                  src={ResetButton}
                  alt="reset button"
                  width={100}
                  height={100}
                />
              </div> */}
          </div>
        </div>
      </div>
      {/* <div style={{ position: 'absolute', top: 0, left: 0 }}>
          {workers.map((worker) => (
            <div
              key={worker.name}
              style={{
                position: 'absolute',
                left: worker.altTargetX,
                top: worker.altTargetY,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'blue',
                color: 'black',
              }}
            >
              {worker.name}
            </div>
          ))}
        </div> */}
    </div>
  );
});

export default BF3School;
