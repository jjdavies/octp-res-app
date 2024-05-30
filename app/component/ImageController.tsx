import React, { useContext, useEffect, useState } from 'react';

import ImageC from './ImageC';
import TargetImageC from './TargetImageC';
import Connections from './Connections';

import ActivityResource from '../interfaces/ActivityResource';
import ContentResource from '../interfaces/ContentResource';
import DataContext from './DataContext';
import ActivityStage from '../interfaces/ActivityStage';

interface ImageControllerProps {
  viewScale: number;
}

export default function ImageController(props: ImageControllerProps) {
  const {
    data,
    selectedImage,
    selectImage,
    settingConnectionActive,
    settingDraggersActive,
    settingDropPositionActive,
    setDropPositionData,
    connectionNode,
    updateImageData,
    settingCorrect,
    settingIncorrect,
    currentStageID,
  } = useContext(DataContext);

  console.log(data);

  const updateData = (
    id: string,
    pos: Object,
    width: number,
    height: number
  ) => {
    if (settingDropPositionActive) {
      console.log(pos);
      return setDropPositionData(id, pos);
    }
    console.log('WARNING: updating image data');
    updateImageData(id, pos, width, height);
  };

  const imageClickHandler = (
    e: React.MouseEvent<Element, MouseEvent>,
    id: string
  ) => {
    console.log('click handler ', id);
    selectImage(id);
  };

  const currentStage: ActivityStage | undefined = data?.stages.filter(
    (stage) => stage.stageID === currentStageID
  )[0];

  return (
    <>
      {currentStage?.connections ? (
        <Connections
          data={currentStage}
          viewScale={props.viewScale}
        />
      ) : (
        <>noconnection</>
      )}
      {data && currentStage ? (
        currentStage.activitySettings.resources.map(
          (resource: ActivityResource) => (
            <>
              <ImageC
                key={resource.resourceID}
                id={resource.resourceID}
                contentResource={
                  data.resources.imagesContents.filter(
                    (res: ContentResource) =>
                      res.contentID === resource.contentRefID
                  )[0]
                }
                width={resource.style.width}
                height={resource.style.height}
                x={
                  +resource.resourceSettings.startPosition.split(
                    ','
                  )[0]
                }
                y={
                  +resource.resourceSettings.startPosition.split(
                    ','
                  )[1]
                }
                zOrder={resource.resourceSettings.staticOrder}
                viewScale={props.viewScale}
                updateData={updateData}
                clickHandler={imageClickHandler}
                selected={selectedImage}
                locked={resource.resourceSettings.buildLocked}
                connectionNode={connectionNode}
                draggable={resource.resourceSettings.draggable}
                settingDraggersActive={settingDraggersActive}
                settingDropPositionActive={settingDropPositionActive}
                settingCorrect={settingCorrect}
                settingIncorrect={settingIncorrect}
                multichoice={resource.resourceSettings.multichoice}
              />
              {settingDropPositionActive && (
                <TargetImageC
                  key={resource.resourceID + 'target'}
                  id={resource.resourceID}
                  contentResource={
                    data.resources.imagesContents.filter(
                      (res: ContentResource) =>
                        res.contentID === resource.contentRefID
                    )[0]
                  }
                  width={resource.style.width}
                  height={resource.style.height}
                  x={
                    +resource.resourceSettings.targetPosition.split(
                      ','
                    )[0]
                  }
                  y={
                    +resource.resourceSettings.targetPosition.split(
                      ','
                    )[1]
                  }
                  zOrder={resource.resourceSettings.staticOrder}
                  viewScale={props.viewScale}
                  locked={true}
                  draggable={false}
                />
              )}
            </>
          )
        )
      ) : (
        <>NoData</>
      )}
    </>
  );
}
