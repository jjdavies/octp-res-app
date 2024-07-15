'use server';
import React from 'react';
import fsPromises from 'fs/promises';

export const test = async () => {
  console.log('test');
};

export const saveJson = async (json: any) => {
  console.log(json.videofiles[0].tags);
  const jsonp = JSON.stringify(json);
  console.log(jsonp);
  const result = await fsPromises.writeFile(
    'app/videofiles.json',
    jsonp
  );
  console.log(result);
};
