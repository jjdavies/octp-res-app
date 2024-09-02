import React, { useContext, useState } from 'react';
import Image from 'next/image';
import builderStyles from '../../styles/Builder.module.css';

import nextStage from '../../img/buttons/navArrow.svg';
import blankCircle from '../../img/buttons/blankCircle.svg';
import add from '../../img/buttons/add.svg';
import DataContext from '../DataContext';

interface NavigationProps {
  stages: string[];
}

export default function Navigation(props: NavigationProps) {
  const imageOptions = [
    {
      group: 'Add Stage',
      dataKey: 'slideType',
      options: [
        { name: 'Blank Stage', value: 'blank' },
        { name: 'Duplicate Stage', value: 'duplicate' },
      ],
    },
  ];
  const {
    currentStageID,
    goToNextStage,
    goToPreviousStage,
    addNewStage,
    stagesPaneSelect,
  } = useContext(DataContext);

  const [addStageSelected, setAddStageSelected] =
    useState<boolean>(false);

  return (
    <div className={builderStyles.navigationContainer}>
      {props.stages.indexOf(currentStageID) > 0 && (
        <div
          className={builderStyles.button}
          onClick={() => goToPreviousStage()}
          onTouchEnd={() => goToPreviousStage()}
        >
          <Image
            className={builderStyles.buttonImage}
            style={{ rotate: '180deg' }}
            src={nextStage}
            alt="right arrow button"
          />
        </div>
      )}
      {/* Current Stage Number / Total Stages */}
      <div
        className={builderStyles.button}
        onClick={() => stagesPaneSelect()}
      >
        <Image
          className={builderStyles.buttonImage}
          src={blankCircle}
          alt="left arrow button"
        />
        {props.stages && (
          <div className={builderStyles.stageNumber}>
            {props.stages.indexOf(currentStageID) + 1}/
            {props.stages.length}
          </div>
        )}
      </div>
      {props.stages.indexOf(currentStageID) <
        props.stages.length - 1 && (
        <div
          className={builderStyles.button}
          onClick={() => goToNextStage()}
          onTouchEnd={() => goToNextStage()}
        >
          <Image
            className={builderStyles.buttonImage}
            src={nextStage}
            alt="right arrow button"
          />
        </div>
      )}
      {props.stages.indexOf(currentStageID) ===
        props.stages.length - 1 && (
        <div
          className={builderStyles.button}
          onClick={() => setAddStageSelected(true)}
          onTouchEnd={() => setAddStageSelected(true)}
        >
          <Image
            className={builderStyles.buttonImage}
            src={add}
            alt="add button"
          />
          {addStageSelected && (
            <div>
              {imageOptions.map((group) => (
                <div
                  key={group.dataKey}
                  className={builderStyles.dropDownGroup}
                >
                  <div className={builderStyles.dropDownGroupName}>
                    {group.group}
                  </div>
                  {group.options.map((option) => (
                    <div
                      key={option.name}
                      className={builderStyles.dropDownOption}
                      onClick={() => addNewStage(option.value)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
