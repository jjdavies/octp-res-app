'use client';
import React, { memo, useState } from 'react';
import { useEffect } from 'react';
import sceneStyles from '../../styles/Scene.module.css';
import '../../styles/spine-player.css';

import { SpinePlayer } from '@esotericsoftware/spine-player';
// import Draggable from 'react-draggable';

const init = () => {
  const playerWidth = 1030;
  const playerHeight = 579;

  return new SpinePlayer('container', {
    jsonUrl: '/scenes/daynight/daynight.json',
    atlasUrl: '/scenes/daynight/daynight.atlas',
    animation: 'static',
    premultipliedAlpha: true,
    backgroundColor: '#282c34',
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
      var lake = animationState.setAnimation(1, 'lake', true);
      var fire = animationState.setAnimation(2, 'fire', true);
      var cloud = animationState.setAnimation(3, 'cloud', true);
      cloud.timeScale = 0.2;
    },

    frame: (player) => {
      var animationState = player.animationState;
      var canvasOverlay = document.getElementById('canvasOverlay');
      if (canvasOverlay === null) return;
      const dayStage = canvasOverlay.dataset.daystage;
      if (dayStage === 'morning') {
        var morning = animationState.setAnimation(
          4,
          'morning',
          false
        );
        var morninghike = animationState.setAnimation(
          5,
          'morninghike',
          false
        );
        animationState.setEmptyAnimation(6);
        canvasOverlay.dataset.daystage = 'datareset';
      }
      if (dayStage === 'afternoon') {
        var morning = animationState.setAnimation(
          4,
          'afternoon',
          false
        );
        var afternoonswim = animationState.setAnimation(
          5,
          'afternoonswim',
          false
        );
        var splashing = animationState.setAnimation(
          6,
          'splashing',
          true
        );
        splashing.delay = 1;
        canvasOverlay.dataset.daystage = 'datareset';
      }
      if (dayStage === 'night') {
        var night = animationState.setAnimation(4, 'night', false);
        var roastmarshmallows = animationState.setAnimation(
          5,
          'roastmarshmallows',
          false
        );
        animationState.setEmptyAnimation(6);

        canvasOverlay.dataset.daystage = 'datareset';
      }
    },
  });
};

const DayNight = React.memo(() => {
  const [dayStage, setDayStage] = useState('none');
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    var player = init();
    return () => {
      player.dispose();
    };
  }, []);

  const morningClick = () => {
    setDayStage('morning');
    setOverlay(false);
  };
  const afternoonClick = () => {
    setDayStage('afternoon');
    setOverlay(false);
  };
  const nightClick = () => {
    setDayStage('night');
    setOverlay(false);
  };
  const canvasClick = (e) => {
    if (e.target.id === 'canvasOverlay') setOverlay(true);
  };
  return (
    <div className={sceneStyles.sceneContainer}>
      <div
        onClick={canvasClick}
        id="container"
        style={{
          maxWidth: '1030px',
          aspectRatio: '16/9',
          margin: 'auto',
          display: 'flex',
          // padding: '10% 0',
          // height: '100vh',

          justifyContent: 'center',
        }}
      >
        <div
          id="canvasOverlay"
          className={sceneStyles.canvasOverlay}
          data-daystage={dayStage}
        >
          {overlay && (
            <>
              <button
                className={
                  sceneStyles.button + ' ' + sceneStyles.morningButton
                }
                onClick={morningClick}
              >
                Morning
              </button>
              <button
                className={
                  sceneStyles.button +
                  ' ' +
                  sceneStyles.afternoonButton
                }
                onClick={afternoonClick}
              >
                Afternoon
              </button>
              <button
                className={
                  sceneStyles.button + ' ' + sceneStyles.nightButton
                }
                onClick={nightClick}
              >
                Night
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default DayNight;
