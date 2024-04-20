'use client';

import React, { useEffect, useState } from 'react';
import Player from '../../component/Player';
import Activity from '@/app/interfaces/NewActivity';

import { DataProvider as PlayerDataProvider } from '../../component/DataContext';
interface ActivitySlugProps {
  params: { slug: string };
}

const fetcher = (url: URL) => fetch(url).then((res) => res.json());

const fetchFile = async (filename: URL) => {
  return new Promise((resolve, reject) => {
    console.log(`/activityfiles/${filename}.json`);
    fetcher(`/activityfiles/${filename}.json`).then((res, err) => {
      if (res) resolve(res);
      if (err) reject();
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
      const activityFile: Activity = await fetchFile(slug);
      console.log(activityFile);
      setActivityFile(activityFile);
    };
    loadActivityFile();
    // setActivityFile(fetchFile('school'));
  }, []);

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
