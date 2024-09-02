'use client';

import React, { useEffect, useState } from 'react';
import Player from '../../component/Player';
import Activity from '@/app/interfaces/NewActivity';
import path from 'path';

import { DataProvider as PlayerDataProvider } from '../../component/player/DataContext';
interface ActivitySlugProps {
  params: { slug: string };
}

// const fetcher = (url: URL) => fetch(url).then((res) => res.json());
function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

const fetchFile = async (filename: string) => {
  return new Promise((resolve, reject) => {
    console.log('/activityfiles/' + encodeURI(filename) + '.json');
    const url = '/activityfiles/' + encodeURI(filename) + '.json';
    // const URL: URL = path.join('/activityfiles/', filename, '.json');
    // const url = new URL('/activityfiles/' + filename + '.json');
    fetcher(url).then((res) => {
      if (res) resolve(res);
      // if (err) reject();
    });
  });
};

export default function Activityslug(props: ActivitySlugProps) {
  const slug = props.params.slug;
  const [fileLoaded, setFileLoaded] = useState(false);
  const [activityFile, setActivityFile] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    const loadActivityFile = async () => {
      const activityFile = await fetchFile(slug);
      console.log(activityFile);
      setActivityFile(activityFile as Activity);
    };
    loadActivityFile();
    // setActivityFile(fetchFile('school'));
  }, [slug]);

  return (
    <div>
      <PlayerDataProvider>
        <span>{slug ? slug : 'loading...'}</span>
        {activityFile !== null && (
          <Player data={activityFile} name={slug} />
        )}
      </PlayerDataProvider>
    </div>
  );
}
// function res(value: any) {
//   throw new Error('Function not implemented.');
// }
