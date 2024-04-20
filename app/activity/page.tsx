'use client';
import React, { useState } from 'react';
import allofflineData from '../activityfiles.json';
import uiStyles from '../styles/UI.module.css';
import Link from 'next/link';
import Image from 'next/image';
import BrokenFile from '../img/icons/brokenfile.png';
import SmallX from '../img/icons/x.svg';
import Activity from '../interfaces/NewActivity';

interface ActivityLink {
  activity: any;
  courseFilter: string;
  showErrorFiles: boolean;
}

const ActivityLink = (props: ActivityRecord) => {
  const { courseFilter, activity, showErrorFiles } = props;
  console.log(props);
  let showActivity = false;
  let thumb = '/thumbs/' + activity.name.split('.json')[0] + '.png';
  if (courseFilter === '-') {
    if (showErrorFiles && activity.status === 'configerror')
      showActivity = true;
    if (activity.status === 'active') showActivity = true;
  }
  if (activity.lessontag === courseFilter) showActivity = true;
  if (!showErrorFiles && activity.status === 'configerror')
    showActivity = false;
  return (
    <>
      {showActivity && (
        <Link
          key={activity.name}
          href={'/activity/' + activity.name.split('.json')[0]}
        >
          <div className={uiStyles.activityItem}>
            {activity.name}
            <Image
              src={
                activity.status === 'configerror' ? BrokenFile : thumb
              }
              width={192}
              height={108}
              alt="thumb"
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default function Page() {
  const availableActivities = allofflineData.activities;
  const showErrorFiles = false;
  // const [filterItems, setFilterItems] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('-');

  const courseSelected = (e) => {
    setSelectedCourse(e.target.value);
  };

  const removeSelectedCourse = () => {
    setSelectedCourse('-');
  };
  // const filterItems = [selectedCourse]
  return (
    <div className={uiStyles.activityPage}>
      <div className={uiStyles.filterMenu}>
        Filter:
        {selectedCourse !== '-' && (
          <div
            className={uiStyles.chosenFilterItem}
            onClick={removeSelectedCourse}
          >
            {selectedCourse}
            <div className="remove">
              <Image src={SmallX} alt="x" width={20} height={20} />
            </div>
          </div>
        )}
        <div className={uiStyles.filterItem}>
          <label>Course:</label>
          <select
            className={uiStyles.select}
            value={selectedCourse}
            onChange={courseSelected}
          >
            <option>-</option>
            <option>BF1</option>
            <option>BF2</option>
            <option>BF3</option>
            <option>BE1</option>
            <option>BE2</option>
          </select>
        </div>
        {/* <div className={uiStyles.filterItem}>
          <label>Topic:</label>
          <select className={uiStyles.select}>
            <option>-</option>
            <option>Animals</option>
            <option>Clothes</option>
            <option>Food</option>
            <option>Family</option>
            <option>Things</option>
          </select>
        </div> */}
      </div>
      <div
        className={uiStyles.activityList}
        style={{ display: 'flex' }}
      >
        {availableActivities.map((act, index) => (
          <ActivityLink
            activity={act}
            courseFilter={selectedCourse}
            showErrorFiles={showErrorFiles}
            key={act.name}
          />
        ))}
      </div>
    </div>
  );
}
