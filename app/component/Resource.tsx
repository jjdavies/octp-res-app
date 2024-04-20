import Image from 'next/image';
import useSound from 'use-sound';
import { setgroups } from 'process';
import React, {
  useContext,
  useEffect,
  useState,
  CSSProperties,
} from 'react';
import Draggable from 'react-draggable';
import ActivityResource from '../interfaces/ActivityResource';
import DataContext from './DataContext';

import CorrectIcon from '../img/buttons/assignCorrect.svg';
import IncorrectIcon from '../img/buttons/assignIncorrect.svg';

import CanvasClip from './CanvasClip';

import builderStyles from '../styles/Builder.module.css';
import Trigger from '../interfaces/Trigger';

import { useSpring, animated, easings } from '@react-spring/web';

interface ResourceProps {
  resourceData: ActivityResource;
  multi?: Boolean;
  addResource?: Function;
  static?: boolean;
}

export default function Resource(props: ResourceProps) {
  //data context
  const {
    data,
    matchSelect,
    selectNewMatch,
    currentStageID,
    triggerAction,
    triggerActions,
  } = useContext(DataContext);

  const activityResource = props.resourceData;
  const resourceData = data?.resources.imagesContents.filter(
    (img) => img.contentID === activityResource.contentRefID
  )[0];
  const resourceFormat = resourceData?.format;
  const resourceContent = resourceData
    ? (resourceData.base64 as string)
    : '';
  const width: number = activityResource.style.width;
  const height: number = activityResource.style.height;
  const originalPos = {
    x: +activityResource.resourceSettings.startPosition.split(',')[0],
    y: +activityResource.resourceSettings.startPosition.split(',')[1],
  };
  const dragEnabled = activityResource.resourceSettings.draggable;

  const [pos, setPos] = useState({
    x: originalPos.x,
    y: originalPos.y,
  });
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [showMultiChoiceAnswer, setShowMultiChoiceAnswer] =
    useState(false);

  const filter = [
    matchSelect === activityResource.resourceID
      ? 'drop-shadow(0px 0px 15px yellow'
      : '',
  ];

  const [
    currentAnimationPropertyValues,
    setCurrentAnimationPropertyValues,
  ] = useState({
    opacity: activityResource.resourceSettings.visible
      ? '100%'
      : '0%',
    rotate: '0deg',
    left: '0',
    top: '0',
  });

  const [
    targetAnimationPropertyValues,
    setTargetAnimationPropertyValues,
  ] = useState({
    opacity: activityResource.resourceSettings.visible
      ? '100%'
      : '0%',
    rotate: '0deg',
    left: '0',
    top: '0',
  });
  const [duration, setDuration] = useState(0);
  const [delay, setDelay] = useState(0);

  const [springs, api] = useSpring(
    () => ({
      from: {
        opacity: currentAnimationPropertyValues.opacity,
        rotate: currentAnimationPropertyValues.rotate,
        left: currentAnimationPropertyValues.left,
        top: currentAnimationPropertyValues.top,
      },
      to: {
        opacity: targetAnimationPropertyValues.opacity,
        rotate: targetAnimationPropertyValues.rotate,
        left: targetAnimationPropertyValues.left,
        top: targetAnimationPropertyValues.top,
      },
      delay: delay,
      config: { duration: duration, easing: easings.easeOutSine },
    }),
    [currentAnimationPropertyValues, targetAnimationPropertyValues]
  );

  const actionsWithResTriggers = data?.actions.map((act) => {
    const relActions = act.triggers.filter(
      (trig) => trig.type === 'ResourceTrigger'
    );
    return relActions[0].trigger.resourceID;
  });
  const isResourceTrigger: boolean =
    (actionsWithResTriggers?.indexOf(activityResource.resourceID) !==
      -1 &&
      currentAnimationPropertyValues.opacity !== '0%') ||
    activityResource.resourceSettings.multichoice !== '' ||
    data?.stages.filter(
      (stage) => stage.stageID === currentStageID
    )[0].connections.length !== 0;

  const imgDivStyle: CSSProperties = {
    position: 'absolute',
    zIndex:
      activityResource.resourceSettings.zPosType === 'FORE'
        ? 999
        : activityResource.resourceSettings.staticOrder,
    filter: filter,
    // animationName: animation ? animation.animation : '',
  };

  const sndDivStyle = {
    position: 'relative',
    zIndex: activityResource.resourceSettings.staticOrder,
    filter: filter,
  };

  const [ding] = useSound('/snd/ding.mp3');
  const [splat] = useSound('/snd/splat.mp3');

  useEffect(() => {
    //check data to see if animations are present for this resource
    const animations = activityResource.resourceSettings.animations;
    // console.log(activityResource.resourceID, 'animations: ', animations);

    if (animations) {
      let newAnims = {
        ...targetAnimationPropertyValues,
      };
      animations.map((anim) => {
        if (anim.property === 'position') {
          let posX: number =
            anim.value.split(',')[0].split('px')[0] - pos.x;
          let posY: number =
            anim.value.split(',')[1].split('px')[0] - pos.y;
          console.log(posX, posY);
          // let posY: number = anim.value.split(',')[1];
          return (newAnims = {
            ...newAnims,
            left: posX + 'px',
            top: posY + 'px',
          });
        }
        newAnims = { ...newAnims, [anim.property]: anim.value };
      });

      // animations.map((anim) => {});
      setTargetAnimationPropertyValues({
        ...targetAnimationPropertyValues,
        ...newAnims,
      });
      //set current animation value to target once complete
      setTimeout(() => {
        setCurrentAnimationPropertyValues({
          ...targetAnimationPropertyValues,
          ...newAnims,
        });
      }, duration);
    }
  }, [props]);

  const checkForActions = (event: string) => {
    if (data && data.actions) {
      const relActions = data.actions.filter((action) => {
        const relTriggers = action.triggers.filter(
          (trig: Trigger) => {
            console.log(trig);
            if (
              trig.type === 'ResourceTrigger' &&
              trig.trigger.resourceID ===
                activityResource.resourceID &&
              trig.trigger.event === event
            )
              return true;
            return false;
          }
        );
        if (relTriggers.length > 0) return true;
        return false;
      });
      console.log(relActions);
      triggerActions(relActions);
      // relActions.map((action) => triggerAction(action));
    }
  };

  const dragStart = () => {
    setHasDragged(false);
  };

  const dragInProgress = (e, ui) => {
    setHasDragged(true);
    setPos({ x: ui.x, y: ui.y });
  };

  const dragComplete = (e, ui) => {
    if (props.multi && props.addResource) props.addResource();
    if (activityResource.resourceSettings.targetPosition !== '0,0') {
      //target position available
      //check for target match
      const targetPos = {
        x: +activityResource.resourceSettings.targetPosition.split(
          ','
        )[0],
        y: +activityResource.resourceSettings.targetPosition.split(
          ','
        )[1],
      };
      if (
        Math.abs(pos.x - targetPos.x) < 60 &&
        Math.abs(pos.y - targetPos.y) < 60
      ) {
        //drag to target success
        setPos({ x: targetPos.x, y: targetPos.y });
        //check for drag to target success action
        checkForActions('drag to target - success');
        return;
      }

      //return to original position
      setPos({ x: originalPos.x, y: originalPos.y });
    }
  };

  const resourceClick = () => {
    console.log('click');
    //check that a drag hasn't occurred
    if (!hasDragged) {
      //check for actions
      checkForActions('Click');
      //check for connections
      const connections = data?.stages.filter(
        (stage) => stage.stageID === currentStageID
      )[0].connections;
      if (connections && connections.length > 0) {
        //some match connections exist
        selectNewMatch(activityResource.resourceID);
      }
      console.log(
        'multichoice ',
        props.resourceData.resourceSettings.multichoice
      );
      if (
        props.resourceData.resourceSettings.multichoice ===
          'correct' ||
        props.resourceData.resourceSettings.multichoice ===
          'incorrect'
      ) {
        if (
          props.resourceData.resourceSettings.multichoice ===
          'correct'
        ) {
          ding();
          setShowMultiChoiceAnswer(true);
        }
        if (
          props.resourceData.resourceSettings.multichoice ===
          'incorrect'
        ) {
          splat();
          setShowMultiChoiceAnswer(true);
        }
      }
    }
  };

  return (
    <div>
      {data &&
        data?.stages.filter(
          (stage) => stage.stageID === currentStageID
        )[0].activitySettings.resources.length > 0 &&
        (props.static ? (
          // <div style={{ ...imgDivStyle, pointerEvents: 'none' }}>
          <animated.div
            style={{
              ...imgDivStyle,
              ...{
                pointerEvents: isResourceTrigger ? 'initial' : 'none',
              },
              ...springs,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
              }}
            >
              <Image
                src={resourceContent}
                width={width}
                height={height}
                draggable={false}
                alt="resource"
                onClick={resourceClick}
                onTouchEnd={resourceClick}
              />
            </div>
            <div
              className={builderStyles.multiChoiceAnswer}
              style={{
                left: pos.x + width / 2,
                top: pos.y + height / 2,
              }}
            >
              {showMultiChoiceAnswer && (
                <Image
                  src={
                    props.resourceData.resourceSettings
                      .multichoice === 'correct'
                      ? CorrectIcon
                      : IncorrectIcon
                  }
                  alt="multi choice answer icon"
                />
              )}
            </div>
          </animated.div>
        ) : (
          <>
            <Draggable
              position={{ x: pos.x, y: pos.y }}
              onStart={dragStart}
              onDrag={dragInProgress}
              onStop={dragComplete}
              disabled={!dragEnabled}
            >
              <animated.div
                style={{
                  ...imgDivStyle,
                  ...{
                    pointerEvents: isResourceTrigger
                      ? 'initial'
                      : 'initial',
                  },
                  ...springs,
                }}
              >
                {resourceFormat === 'image' && (
                  <>
                    <Image
                      src={resourceContent}
                      width={width}
                      height={height}
                      draggable={false}
                      alt="resource"
                      onClick={resourceClick}
                      onTouchEnd={resourceClick}
                    />
                  </>
                )}
                {resourceFormat === undefined && (
                  <>
                    <Image
                      src={resourceContent}
                      width={width}
                      height={height}
                      draggable={false}
                      alt="resource"
                      onClick={resourceClick}
                      onTouchEnd={resourceClick}
                    />
                  </>
                )}
                {resourceFormat === 'wav' && (
                  <>
                    <CanvasClip
                      width={width}
                      height={height}
                      src={resourceContent}
                      format={resourceFormat}
                      clickHandler={resourceClick}
                    />
                  </>
                )}
                {resourceFormat === 'mp3' && (
                  <>
                    <CanvasClip
                      width={width}
                      height={height}
                      src={resourceContent}
                      format={resourceFormat}
                      clickHandler={resourceClick}
                    />
                  </>
                )}
              </animated.div>
            </Draggable>
            <div
              className={builderStyles.multiChoiceAnswer}
              style={{
                left: pos.x + width / 2,
                top: pos.y + height / 2,
              }}
            >
              {showMultiChoiceAnswer && (
                <Image
                  src={
                    props.resourceData.resourceSettings
                      .multichoice === 'correct'
                      ? CorrectIcon
                      : IncorrectIcon
                  }
                  alt="multi choice answer icon"
                />
              )}
            </div>
          </>
        ))}
    </div>
  );
}
