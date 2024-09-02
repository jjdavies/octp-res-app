import React, { useContext } from 'react';

import NewButton from './buttons/NewButton';
import Navigation from './buttons/Navigation';

import builderStyles from '../styles/Builder.module.css';
import DataContext from './DataContext';

import ButtonData from '../interfaces/ButtonData';
import ResourceTypeSelect from './ResourceTypeSelect';

interface TopPaneProps {
  buttons: ButtonData[];
}

export default function TopPane(props: TopPaneProps) {
  const {
    data,
    actionsPaneSelect,
    sendToBack,
    bringToFront,
    selectedImage,
    deleteImageFromData,
    lockImage,
    setVisible,
    setDraggers,
    settingDraggersActive,
    setConnection,
    settingConnectionActive,
    setDropPosition,
    settingDropPositionActive,
    offlineSave,
    optionsSelected,
    setMultiChoiceOption,
    currentStageID,
    addNewStage,
    goToPreviousStage,
    goToNextStage,
    setModalSave,
  } = useContext(DataContext);

  const buttons = props.buttons;

  const buttonHandler = (action: string) => {
    const setImagesDisable =
      settingDraggersActive ||
      settingDropPositionActive ||
      settingConnectionActive ||
      optionsSelected
        ? true
        : false;
    const imageFormatDisable =
      selectedImage === '' || setImagesDisable ? true : false;
    console.log(
      'setImagesDisable',
      setImagesDisable,
      'imageFormatDisable',
      imageFormatDisable
    );
    switch (action) {
      case 'actionsPaneButton':
        console.log('ac');
        actionsPaneSelect();
      case 'bringToFront':
        if (!imageFormatDisable) bringToFront();
        break;
      case 'sendToBack':
        if (!imageFormatDisable) sendToBack();
        break;
      case 'deleteImage':
        if (!imageFormatDisable) deleteImageFromData();
        break;
      case 'lockImage':
        if (!imageFormatDisable) lockImage();
        break;
      case 'visible':
        if (!imageFormatDisable) setVisible();
        break;
      case 'setDraggers':
        if (settingDraggersActive) return setDraggers();
        if (!setImagesDisable) return setDraggers();
        break;
      case 'setDropPosition':
        if (settingDropPositionActive) return setDropPosition();
        if (!setImagesDisable) return setDropPosition();
        break;
      case 'setConnection':
        if (settingConnectionActive) return setConnection();
        if (!setImagesDisable) return setConnection();
        break;
      case 'offlineSave':
        if (settingConnectionActive) return;
        if (settingDraggersActive) return;
        if (optionsSelected) return;
        //open a modal window to set filename and tag
        setModalSave();
        // offlineSave();
        break;
      case 'assignCorrect':
      case 'assignIncorrect':
        if (settingConnectionActive) return;
        if (settingDraggersActive) return;
        if (optionsSelected) return;
        setMultiChoiceOption(action);
        break;
    }
  };

  return (
    <div className={builderStyles.topPane}>
      {/* Format Buttons */}
      <div className={builderStyles.buttonGroupLabel}>
        Format
        <div className={builderStyles.buttonGroup}>
          {buttons
            .filter((button) => button.group === 'format')
            .map((button) => (
              <NewButton
                key={button.name}
                buttonData={button}
                buttonHandler={buttonHandler}
              />
            ))}
        </div>
      </div>
      {/* Dragging Buttons */}
      <div className={builderStyles.buttonGroupLabel}>
        Dragging
        <div className={builderStyles.buttonGroup}>
          {buttons
            .filter((button) => button.group === 'dragging')
            .map((button) => (
              <NewButton
                key={button.name}
                buttonData={button}
                buttonHandler={buttonHandler}
              />
            ))}
        </div>
      </div>
      {/* Setup Buttons */}
      <div className={builderStyles.buttonGroupLabel}>
        Setup
        <div className={builderStyles.buttonGroup}>
          {buttons
            .filter((button) => button.group === 'setup')
            .map((button) => (
              <NewButton
                key={button.name}
                buttonData={button}
                buttonHandler={buttonHandler}
              />
            ))}
        </div>
      </div>
      {/* Tools Buttons */}
      <div className={builderStyles.buttonGroupLabel}>
        Tools
        <div className={builderStyles.buttonGroup}>
          {buttons
            .filter((button) => button.group === 'tools')
            .map((button) => (
              <NewButton
                key={button.name}
                buttonData={button}
                buttonHandler={buttonHandler}
              />
            ))}
        </div>
      </div>
      {/* File Buttons */}
      <div className={builderStyles.buttonGroupLabel}>
        File
        <div className={builderStyles.buttonGroup}>
          {buttons
            .filter((button) => button.group === 'file')
            .map((button) => (
              <NewButton
                key={button.name}
                buttonData={button}
                buttonHandler={buttonHandler}
              />
            ))}
        </div>
      </div>
      {data && <Navigation stages={data.setup.stages} />}
      {/* <ResourceTypeSelect /> */}
    </div>
  );
}
