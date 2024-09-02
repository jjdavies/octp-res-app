'use client';
import React, { useEffect, useState } from 'react';
import Draggable, {
  DraggableData,
  DraggableEvent,
} from 'react-draggable';
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

import ResetButton from '../../img/buttons/resetbutton.png';
import NavArrow from '../../img/buttons/navArrow.svg';

// import schoolAmbience from '../sounds/schoolambience.mp3';

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
      var pianofingering = animationState.setAnimation(
        1,
        'pianofingering',
        true
      );
      var pianoheadturn = animationState.setAnimation(
        2,
        'pianoheadturn',
        true
      );
      var pianolean = animationState.setAnimation(
        3,
        'pianolean',
        true
      );
      var mtkidsdance = animationState.setAnimation(
        4,
        'mtkidsdance',
        true
      );
      mtkidsdance.timeScale = 0.7;
      // var etteacher = animationState.setAnimation(
      //   5,
      //   'etgesturing',
      //   true
      // );
      var etkid2 = animationState.setAnimation(
        6,
        'etkid2nodding',
        true
      );
      var etkid4 = animationState.setAnimation(
        7,
        'etkid4nodding',
        true
      );
      var bus = animationState.setAnimation(8, 'bus', true);
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

      //remove workers
      animationState?.addAnimation(30, 'absent/gatekeeper', false);
      animationState?.addAnimation(31, 'absent/gymteacher', false);
      animationState?.addAnimation(32, 'absent/janitor', false);
      animationState?.addAnimation(33, 'absent/principal', false);
      animationState?.addAnimation(34, 'absent/secretary', false);
      animationState?.addAnimation(
        35,
        'absent/englishteacher',
        false
      );
      animationState?.addAnimation(36, 'absent/musicteacher', false);
      animationState?.addAnimation(37, 'absent/busdriver', false);
      //stop the bus
      animationState?.addAnimation(38, 'absent/stopbus', false);
    },

    frame: (player) => {
      var animationState = player.animationState;
      var sceneContainer = document.getElementById('sceneContainer');
      var leftPane = document.getElementById('leftPane');
      const zoomstatus = sceneContainer.dataset.zoomstatus;
      // console.log(zoomstatus);
      if (sceneContainer === null) return;
      console.log('zoom: ', zoomstatus);
      if (zoomstatus === 'music') {
        var zoomMusic = animationState.setAnimation(
          25,
          'zoommusicclassroom',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'english') {
        var zoomMusic = animationState.setAnimation(
          25,
          'zoomenglishclassroom',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'office') {
        var zoomMusic = animationState.setAnimation(
          25,
          'zoomoffice',
          false
        );
        var fadeOutBus = animationState?.setAnimation(
          26,
          'fadeoutbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'gym') {
        var zoomMusic = animationState.setAnimation(
          25,
          'zoomgym',
          false
        );
        var fadeOutBus = animationState?.setAnimation(
          26,
          'fadeoutbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'gate') {
        var zoomMusic = animationState.setAnimation(
          25,
          'zoomgate',
          false
        );
        var fadeOutBus = animationState?.setAnimation(
          26,
          'fadeoutbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'outfrommusic') {
        var zoomOutMusic = animationState.setAnimation(
          25,
          'zoomoutfrommusic',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'outfromenglish') {
        var zoomOutMusic = animationState.setAnimation(
          25,
          'zoomoutfromenglish',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'outfromoffice') {
        var zoomOutMusic = animationState.setAnimation(
          25,
          'zoomoutfromoffice',
          false
        );
        var fadeInBus = animationState?.setAnimation(
          26,
          'fadeinbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'outfromgym') {
        var zoomOutMusic = animationState.setAnimation(
          25,
          'zoomoutfromgym',
          false
        );
        var fadeInBus = animationState?.setAnimation(
          26,
          'fadeinbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (zoomstatus === 'outfromgate') {
        var zoomOutMusic = animationState.setAnimation(
          25,
          'zoomoutfromgate',
          false
        );
        var fadeInBus = animationState?.setAnimation(
          26,
          'fadeinbus',
          false
        );
        sceneContainer.dataset.zoomstatus = 'null';
      }
      if (leftPane === null) return;
      if (leftPane.dataset.englishteacherplaced === 'true') {
        animationState?.setAnimation(
          35,
          'present/englishteacher',
          false
        );
        leftPane.dataset.englishteacherplaced = 'false';
      }
      if (leftPane.dataset.musicteacherplaced === 'true') {
        animationState?.setAnimation(
          36,
          'present/musicteacher',
          false
        );
        leftPane.dataset.musicteacherplaced = 'null';
      }
      if (leftPane.dataset.gymteacherplaced === 'true') {
        animationState?.setAnimation(31, 'present/gymteacher', false);
        leftPane.dataset.gymteacherplaced = 'null';
      }
      if (leftPane.dataset.janitorplaced === 'true') {
        animationState?.setAnimation(32, 'present/janitor', false);
        leftPane.dataset.janitorplaced = 'null';
      }
      if (leftPane.dataset.principalplaced === 'true') {
        animationState?.setAnimation(33, 'present/principal', false);
        leftPane.dataset.principalplaced = 'null';
      }
      if (leftPane.dataset.secretaryplaced === 'true') {
        animationState?.setAnimation(34, 'present/secretary', false);
        leftPane.dataset.secretaryplaced = 'null';
      }
      if (leftPane.dataset.gatekeeperplaced === 'true') {
        console.log('gatekeeperplaced');
        animationState?.setAnimation(30, 'present/gatekeeper', false);
        leftPane.dataset.gatekeeperplaced = 'null';
      }
      if (leftPane.dataset.busdriverplaced === 'true') {
        animationState?.setAnimation(37, 'present/busdriver', false);
        animationState?.setAnimation(38, 'bus', true);
        leftPane.dataset.busdriverplaced = 'null';
      }
      if (leftPane.dataset.resetworkers === 'true') {
        console.log(leftPane.dataset.resetworkers);
        animationState?.setAnimation(30, 'absent/gatekeeper', false);
        animationState?.setAnimation(31, 'absent/gymteacher', false);
        animationState?.setAnimation(32, 'absent/janitor', false);
        animationState?.setAnimation(33, 'absent/principal', false);
        animationState?.setAnimation(34, 'absent/secretary', false);
        animationState?.setAnimation(
          35,
          'absent/englishteacher',
          false
        );
        animationState?.setAnimation(
          36,
          'absent/musicteacher',
          false
        );
        animationState?.setAnimation(37, 'absent/busdriver', false);
        //stop the bus
        animationState?.setAnimation(38, 'absent/stopbus', false);
        leftPane.dataset.resetworkers = 'null';
      }
    },
  });
};

// interface DraggableWorkerProps {
//   worker: any;
//   index: number;
//   onStop: Function;
//   workersPresent: Boolean[];
// }

const DraggableWorker = (props) => {
  const [workerX, setWorkerX] = useState(0);
  const [workerY, setWorkerY] = useState(0);

  useEffect(() => {
    console.log('reset');
    setWorkerX(0);
    setWorkerY(0);
  }, [props.worker]);

  const stopDrag = (e, ui) => {
    setWorkerX(ui.x);
    setWorkerY(ui.y);
    props.onStop(e, ui);
  };

  return (
    <Draggable
      key={props.worker.name}
      onStop={stopDrag}
      position={{ x: workerX, y: workerY }}
    >
      <Image
        id={props.worker.name}
        src={props.worker.src}
        alt={props.worker.name}
        draggable="false"
        width={props.worker.width ? props.worker.width : 60}
        style={{
          display: props.workersPresent[props.index]
            ? 'initial'
            : 'none',
        }}
      />
    </Draggable>
  );
};

// eslint-disable-next-line react/display-name
const BF3School = React.memo(() => {
  const [zoomStatus, setZoomStatus] = useState('out');
  const [soundsStarted, setSoundsStarted] = useState(false);
  const [englishTeacherPlaced, setEnglishTeacherPlaced] =
    useState(false);
  const [gymTeacherPlaced, setGymTeacherPlaced] =
    useState(false);
  const [janitorPlaced, setJanitorPlaced] = useState(false);
  const [gatekeeperPlaced, setGatekeeperPlaced] =
    useState(false);
  const [principalPlaced, setPrincipalPlaced] =
    useState(false);
  const [secretaryPlaced, setSecretaryPlaced] =
    useState(false);
  const [busDriverPlaced, setBusDriverPlaced] =
    useState(false);
  const [musicTeacherPlaced, setMusicTeacherPlaced] =
    useState(false);
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
    let playerRect = new DOMRect();
    playerRect = player
      ? player.getBoundingClientRect()
      : new DOMRect();
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

  const setZoomMusic = (e) => {
    if (!e || !e.currentTarget) return;
    const element = e.target
    const elementID = element.id;
    if (!soundsStarted) {
      console.log('sounds not started')
      schoolSound();
      pianoSound();
      classroomSound();
      officeSound();
      playgroundSound();
      setSoundsStarted(true);
    }
    if (pianosound && pianosound.sound) {
      pianosound.sound.fade(1, 0, 0);
    }
    if (classroomsound && classroomsound.sound) {
      classroomsound.sound.fade(1, 0, 0);
    }
    if (playgroundsound && playgroundsound.sound) {
      playgroundsound.sound.fade(1, 0, 0);
    }
    if (officesound && officesound.sound) {
      officesound.sound.fade(1, 0, 0);
    }
    if (elementID === 'musicClick') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(1, 0.2, 200);
      }

      if (pianosound && pianosound.sound) {
        pianosound.sound.fade(0, 1, 50);
      }

      // pianoSound();
      return setZoomStatus('music');
    }
    if (elementID === 'officeClick') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(1, 0.2, 200);
      }
      if (officesound && officesound.sound) {
        officesound.sound.fade(0, 1, 50);
      }
      return setZoomStatus('office');
    }
    if (elementID === 'gymClick') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(1, 0.2, 200);
      }
      if (playgroundsound && playgroundsound.sound) {
        playgroundsound.sound.fade(0, 1, 50);
      }
      return setZoomStatus('gym');
    }
    if (elementID === 'gateClick') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(1, 0.2, 200);
      }
      return setZoomStatus('gate');
    }
    if (elementID === 'englishClick') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(1, 0.2, 200);
      }
      if (classroomsound && classroomsound.sound) {
        classroomsound.sound.fade(0, 1, 50);
      }
      return setZoomStatus('english');
    }
    if (zoomStatus === 'music') {
      if (pianosound && pianosound.sound) {
        pianosound.sound.fade(1, 0, 500);
      }
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(0.2, 1, 200);
      }
      return setZoomStatus('outfrommusic');
    }
    if (zoomStatus === 'office') {
      if (officesound && officesound.sound) {
        officesound.sound.fade(1, 0, 500);
      }
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(0.2, 1, 200);
      }
      return setZoomStatus('outfromoffice');
    }
    if (zoomStatus === 'english') {
      if (classroomsound && classroomsound.sound) {
        classroomsound.sound.fade(1, 0, 500);
      }
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(0.2, 1, 200);
      }
      return setZoomStatus('outfromenglish');
    }
    if (zoomStatus === 'gym') {
      if (playgroundsound && playgroundsound.sound) {
        playgroundsound.sound.fade(1, 0, 500);
      }
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(0.2, 1, 200);
      }
      return setZoomStatus('outfromgym');
    }
    if (zoomStatus === 'gate') {
      if (schoolsound && schoolsound.sound) {
        schoolsound.sound.fade(0.2, 1, 200);
      }

      return setZoomStatus('outfromgate');
    }
  };
  const handleWorkerStop = (e, ui) => {
    const player = document.getElementById('sceneoverlay');
    let playerRect = new DOMRect();
    playerRect = player
      ? player.getBoundingClientRect()
      : new DOMRect();

    const playerX = playerRect.x;
    const playerY = playerRect.y;
    console.log(ui.node.id, e.target.id);
    let targetNode = document.getElementById(e.target.id);
    const targetRect = targetNode?.getBoundingClientRect();
    const targX = targetRect.x + targetRect.width / 2;
    const targY = targetRect.y + targetRect.height / 2;
    console.log(
      targetRect.x + targetRect.width / 2,
      targetRect.y + targetRect.height / 2
    );
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

    const diffX = Math.abs(targetX - targX);
    const diffY = Math.abs(targetY - targY);
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
      data-zoomstatus={zoomStatus}
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
          onClick={setZoomMusic}
        >
          {zoomStatus.match('out') && (
            <>
              <div
                className={sceneStyles.clickable}
                id="musicClick"
                style={{
                  width: '350px',
                  height: '190px',
                  // background: 'purple',
                  position: 'relative',
                  left: 170,
                  top: 70,
                }}
              ></div>
              <div
                className={sceneStyles.clickable}
                id="englishClick"
                style={{
                  width: '370px',
                  height: '190px',
                  // background: 'green',
                  position: 'relative',
                  left: 525,
                  top: -120,
                }}
              ></div>
              <div
                className={sceneStyles.clickable}
                id="officeClick"
                style={{
                  width: '350px',
                  height: '165px',
                  // background: 'blue',
                  position: 'relative',
                  left: 170,
                  top: -120,
                }}
              ></div>
              <div
                className={sceneStyles.clickable}
                id="gymClick"
                style={{
                  width: '150px',
                  height: '190px',
                  // background: 'yellow',
                  position: 'relative',
                  left: 525,
                  top: -250,
                }}
              ></div>
              <div
                className={sceneStyles.clickable}
                id="gateClick"
                style={{
                  width: '150px',
                  height: '160px',
                  // background: 'red',
                  position: 'relative',
                  left: 375,
                  top: -320,
                }}
              ></div>
            </>
          )}
        </div>
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
            data-englishteacherplaced={englishTeacherPlaced}
            data-musicteacherplaced={musicTeacherPlaced}
            data-gymteacherplaced={gymTeacherPlaced}
            data-principalplaced={principalPlaced}
            data-secretaryplaced={secretaryPlaced}
            data-gatekeeperplaced={gatekeeperPlaced}
            data-busdriverplaced={busDriverPlaced}
            data-janitorplaced={janitorPlaced}
            data-resetWorkers={resetAllWorkers}
          >
            {workers.map((worker, index) => (
              <DraggableWorker
                key={worker.name}
                worker={worker}
                index={index}
                onStop={handleWorkerStop}
                workersPresent={workersPresent}
              />
            ))}
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
            <div
              className={sceneStyles.resetButton}
              onClick={resetWorkers}
            >
              <Image
                src={ResetButton}
                alt="reset button"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
      {
        // <div style={{ position: 'absolute', top: 0, left: 0 }}>
        //   {workers.map((worker) => (
        //     <div
        //       key={worker.name}
        //       style={{
        //         position: 'absolute',
        //         left: worker.targetX,
        //         top: worker.targetY,
        //         width: '20px',
        //         height: '20px',
        //         borderRadius: '50%',
        //         background: 'blue',
        //         color: 'black',
        //       }}
        //     >
        //       {worker.name}
        //     </div>
        //   ))}
        // </div>
      }
    </div>
  );
});

export default BF3School;
