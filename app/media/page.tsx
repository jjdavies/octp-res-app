'use client';
import React, { useState } from 'react';
import library from '../videofiles.json';
import videoStyles from '../styles/Video.module.css';
import uiStyles from '../styles/UI.module.css';
import Link from 'next/link';
import Image from 'next/image';
import BrokenFile from '../img/icons/brokenfile.png';
import NavArrow from '../img/buttons/navArrow.svg';

interface VideoLinkProps {
  name: string;
  // folder: string;
  file: string;
  tags: string[];
  thumb: string;
  selected: string[];
}

const VideoLink = (props: VideoLinkProps) => {
  let show = true;
  props.selected.map((tag) => {
    if (props.tags.includes(tag) === false) {
      show = false;
    }
  });
  if (props.selected.length === 0) show = true;
  console.log(props.selected, props.tags.length);
  if (props.selected[0] === 'UNTAGGED' && props.tags.length === 0)
    show = true;
  if (!show) return;
  return (
    <Link href={'/media/' + props.file.split('.mp4')[0]}>
      <div className={uiStyles.activityItem}>
        <span style={{ width: '192px', overflow: 'hidden' }}>
          {props.name}
        </span>
        <Image
          src={'/classvideolibrary/thumbs/' + props.thumb}
          width={192}
          height={108}
          alt="thumb"
        />
      </div>
    </Link>
  );
};

interface FilteredTagProps {
  tag: string;
  selected: string[];
  onClick: Function;
  inputFilter: string;
}

const FilteredTag = (props: FilteredTagProps) => {
  if (props.inputFilter !== '') {
    if (
      props.tag.substring(0, props.inputFilter.length) !==
      props.inputFilter
    ) {
      if (!props.selected.includes(props.tag)) return;
    }
  }
  if (props.selected.includes(props.tag))
    return (
      <div
        className={videoStyles.tagPillHighlighted}
        key={props.tag}
        onClick={() => props.onClick()}
      >
        {props.tag}
      </div>
    );
  return (
    <div
      className={videoStyles.tagPill}
      key={props.tag}
      onClick={() => props.onClick()}
    >
      {props.tag}
    </div>
  );
};

export default function Page() {
  const videos = library.videofiles;
  const [currentVideoFilters, setCurrentVideoFilters] = useState<
    string[]
  >([]);

  const selectTag = (tag: string) => {
    if (currentVideoFilters.includes(tag)) {
      setCurrentVideoFilters(
        currentVideoFilters.filter((tg) => tg !== tag)
      );
      return;
    }
    setCurrentVideoFilters([...currentVideoFilters, tag]);
  };

  const [inputFilter, setInputFilter] = useState<string>('');
  const changeInputFilter = (e) => {
    setInputFilter(e.target.value);
  };

  return (
    <div className={videoStyles.main}>
      <div className={videoStyles.filterPane}>
        <div>
          <Link href="/">
            <Image
              src={NavArrow}
              width={200}
              height={200}
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                transform: 'rotate(180deg)',
                zIndex: 600,
              }}
              alt="nav arrow"
            />
          </Link>
        </div>
        <h1>Filters:</h1>
        <input
          className={videoStyles.filterInput}
          value={inputFilter}
          onChange={changeInputFilter}
        ></input>
        <div className={videoStyles.tagContainer}>
          {library.tags.sort().map((tag) => (
            <FilteredTag
              key={tag}
              tag={tag}
              selected={currentVideoFilters}
              onClick={() => selectTag(tag)}
              inputFilter={inputFilter}
            />
          ))}
          <FilteredTag
            tag={'UNTAGGED'}
            selected={currentVideoFilters}
            onClick={() => selectTag('UNTAGGED')}
            inputFilter={inputFilter}
          />
        </div>
      </div>
      <div className={videoStyles.videoList}>
        {videos.map((vid) => (
          <VideoLink
            key={vid.name}
            name={vid.name}
            // folder={vid.folder}
            file={vid.file}
            tags={vid.tags}
            // key={vid.name}
            thumb={vid.thumb}
            selected={currentVideoFilters}
          />
        ))}
      </div>
    </div>
  );
}
