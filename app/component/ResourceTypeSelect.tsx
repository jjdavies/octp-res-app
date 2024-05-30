import React, { useContext } from 'react';
import DataContext from './DataContext';

export default function ResourceTypeSelect() {
  const { data, selectedImage, setZPosType } = useContext(DataContext);
  const selectedResource = data?.setup.activitySettings.resources.filter(
    (res) => res.resourceID === selectedImage,
  )[0];
  const zPosType = selectedResource?.resourceSettings.zPosType;

  const changeZPosType = (e) => {
    setZPosType(selectedResource?.resourceID, e.target.value);
  };

  return (
    <div>
      {selectedImage !== '' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="zPosTypeSelect">
            Resource 'z' <br></br>Position Type
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
