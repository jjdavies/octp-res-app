import React, { useContext, useState } from 'react';

import Image from 'next/image';

import Options from '../../img/buttons/options.svg';
import OptionsActive from '../../img/buttons/options_active.svg';

import builderStyles from '../../styles/Builder.module.css';

import DataContext from '../DataContext';
import ActivityStage from '../../interfaces/ActivityStage';

interface OptionsButtonProps {
  activityData: ActivityStage | undefined;
}

export default function OptionsButton(props: OptionsButtonProps) {
  const imageOptions = [
    {
      group: 'Z-Position Type',
      dataKey: 'zPosType',
      options: [
        { name: 'Background', value: 'BACK' },
        { name: 'Mid-ground', value: 'MID' },
        { name: 'Foreground', value: 'FORE' },
      ],
    },
    {
      group: 'Special Image Properties',
      dataKey: 'special',
      options: [
        { name: 'None', value: 'none' },
        { name: 'Generator - Static', value: 'generator-static' },
        { name: 'Generator - Automatic', value: 'generator-auto' },
      ],
    },
  ];
  const {
    data,
    optionsSelected,
    selectOptions,
    selectedImage,
    makeOptionChange,
  } = useContext(DataContext);

  const selectedImageResSettings =
    selectedImage === ''
      ? null
      : props.activityData?.activitySettings.resources.filter(
          (res) => res.resourceID === selectedImage
        )[0].resourceSettings;

  return (
    <div style={{ height: '100%' }}>
      <div
        className={builderStyles.button}
        style={{ width: 'fit-content' }}
      >
        <Image
          onClick={() => selectOptions()}
          className={builderStyles.buttonImage}
          src={selectedImage === '' ? Options : OptionsActive}
          width={200}
          height={200}
          alt="props.data.name"
        />
      </div>
      {optionsSelected && selectedImage !== '' && (
        <div className={builderStyles.dropDown}>
          {imageOptions.map((group) => (
            <div
              className={builderStyles.dropDownGroup}
              key={group.dataKey}
            >
              <div className={builderStyles.dropDownGroupName}>
                {group.group}
              </div>
              {group.options.map((option) => (
                <div
                  key={option.name}
                  className={builderStyles.dropDownOption}
                  onClick={() =>
                    makeOptionChange(group.dataKey, option.value)
                  }
                >
                  {option.name}
                  <div>
                    {/* {selectedImageResSettings?.[group.dataKey] ===
                    option.value
                      ? '✓'
                      : ''} */}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
