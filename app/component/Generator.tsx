import React, { memo, useState } from 'react';
import ActivityResource from '../interfaces/ActivityResource';
import ActivityStage from '../interfaces/ActivityStage';

import Resource from './Resource';

interface GeneratorProps {
  resourceData: ActivityResource;
}

const MemoResource = React.memo(Resource);
export default function Generator(props: GeneratorProps) {
  const [addedResource, setAddedResource] = useState(0);
  const addResource = () => {
    setAddedResource(addedResource + 1);
    console.log(addedResource);
  };
  return (
    <div>
      {[...Array(2 + addedResource)].map((el, index) => (
        <Resource
          key={index}
          resourceData={props.resourceData}
          addResource={addResource}
          multi
        />
      ))}
    </div>
  );
}
