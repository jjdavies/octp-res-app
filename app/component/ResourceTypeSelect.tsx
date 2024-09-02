import React, { useContext } from 'react';
import DataContext from './DataContext';

export default function ResourceTypeSelect() {
  const { data, selectedImage, setZPosType, currentStageID } =
    useContext(DataContext);
  // const selectedResource =
  //   data?.setup.activitySettings.resources.filter(
  //     (res) => res.resourceID === selectedImage
  //   )[0];
  const selectedResource = data?.stages
    .filter((stg) => stg.stageID === currentStageID)[0]
    .activitySettings.resources.filter(
      (res) => res.resourceID === selectedImage
    )[0];
  const zPosType = selectedResource?.resourceSettings.zPosType;
  // const zPosType = selectedResource;

  const changeZPosType = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setZPosType(selectedResource?.resourceID, e.target.value);
  };

  return (
    <div>
      {selectedImage !== '' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="zPosTypeSelect">
            Resource `&apos;`z`&apos;` <br></br>Position Type
          </label>
          <select
            id="zPosTypeSelect"
            onChange={changeZPosType}
            value={zPosType}
          >
            <option value="BACK">BACK</option>
            <option value="MID">MID</option>
            <option value="FORE">FORE</option>
          </select>
        </div>
      )}
    </div>
  );
}
