import React, { useContext } from 'react';
import Image from 'next/image';

import builderStyles from '../../styles/Builder.module.css';
import ButtonData from '../../interfaces/ButtonData';

import SetDraggers from './SetDraggers';
import SetDropPosition from './SetDropPosition';

import DataContext from '../DataContext';

import LockButton from './LockButton';
import SetConnection from './SetConnection';
import OptionsButton from './OptionsButton';
import AssignMultiChoice from './AssignMultiChoice';
import ActionsPaneButton from './ActionsPaneButton';

import visible from '../../img/buttons/visible.svg';
import visibleActive from '../../img/buttons/visibleActive.svg';
import invisible from '../../img/buttons/invisible.svg';

interface ButtonProps {
  buttonData: ButtonData;
  buttonHandler: Function;
}

export default function Button(props: ButtonProps) {
  const {
    data,
    sendToBack,
    bringToFront,
    selectedImage,
    deleteImageFromData,
    setDraggers,
    settingDraggersActive,
    settingDropPositionActive,
    setConnection,
    settingConnectionActive,
    optionsSelected,
    settingCorrect,
    settingIncorrect,
    currentStageID,
    actionsPaneActive,
    actionsPaneSelect,
  } = useContext(DataContext);

  const imageFormatDisable =
    selectedImage === '' ||
    settingConnectionActive ||
    settingDraggersActive ||
    settingDropPositionActive;
  optionsSelected;
  const style = {
    filter: `saturate(${imageFormatDisable ? 0 : 100}%)`,
  };

  const buttonHandlerFunc = () => {
    //!!

    //still require disable checking on top pane
    props.buttonHandler(props.buttonData.action);
  };

  let currentStage = null;
  if (data?.stages) {
    currentStage = data?.stages.filter(
      (stage) => stage.stageID === currentStageID
    )[0];
  }

  if (props.buttonData.name === 'lockImage') {
    return (
      <LockButton
        activityStage={currentStage}
        selectedImage={selectedImage}
        disabled={imageFormatDisable}
        buttonHandler={buttonHandlerFunc}
      />
    );
  }
  if (props.buttonData.name === 'setDraggers') {
    return (
      <SetDraggers
        activityData={data}
        buttonHandler={buttonHandlerFunc}
        setDraggers={setDraggers}
        settingDraggersActive={settingDraggersActive}
      />
    );
  }
  if (props.buttonData.name === 'setDropPosition') {
    return (
      <SetDropPosition
        activityData={data}
        buttonHandler={buttonHandlerFunc}
        setDraggers={setDraggers}
        settingDropPositionActive={settingDropPositionActive}
      />
    );
  }
  if (props.buttonData.name === 'setConnection') {
    return (
      <SetConnection
        activityData={data}
        buttonHandler={buttonHandlerFunc}
        setConnection={setConnection}
        settingConnectionActive={settingConnectionActive}
        disabled={settingDraggersActive}
      />
    );
  }
  if (
    props.buttonData.name === 'assignCorrect' ||
    props.buttonData.name === 'assignIncorrect'
  ) {
    return (
      <AssignMultiChoice
        src={props.buttonData.icon}
        active={
          props.buttonData.name === 'assignCorrect'
            ? settingCorrect
            : settingIncorrect
        }
        buttonHandler={buttonHandlerFunc}
        selectedImage={selectedImage}
      />
    );
  }
  if (props.buttonData.name === 'actionsPaneButton') {
    return (
      <ActionsPaneButton
        buttonHandler={buttonHandlerFunc}
        active={actionsPaneActive}
      />
    );
  }
  if (props.buttonData.name === 'options') {
    return (
      <OptionsButton
        activityData={
          data?.stages.filter(
            (stage) => stage.stageID === currentStageID
          )[0]
        }
        // buttonHandler={buttonHandlerFunc}
        // setConnection={setConnection}
        // settingConnectionActive={settingConnectionActive}
      />
    );
  }
  if (props.buttonData.name === 'visible') {
    let src = visible;
    if (selectedImage) {
      const active = data?.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === selectedImage
        )[0].resourceSettings.visible;
      console.log(active);
      src = active ? visibleActive : invisible;
    }

    return (
      <div
        className={builderStyles.button}
        onClick={buttonHandlerFunc}
      >
        <Image
          className={builderStyles.buttonImage}
          src={src}
          width={200}
          height={200}
          style={style}
          alt="props.data.name"
        />
      </div>
    );
  }
  return (
    <div className={builderStyles.button} onClick={buttonHandlerFunc}>
      <Image
        className={builderStyles.buttonImage}
        src={props.buttonData.icon}
        width={200}
        height={200}
        style={style}
        alt="props.data.name"
      />
    </div>
  );
}
