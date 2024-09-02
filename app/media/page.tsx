'use client';
import React, { ChangeEvent, useState } from 'react';
import library from '../mediafiles.json';
import multimediaStyles from '../styles/Multimedia.module.css';
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
  typeFilter: string;
  type: string;
  size: { w: number; h: number };
}

const MediaLink = (props: VideoLinkProps) => {
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
  if (props.typeFilter === 'Video' && props.type !== 'video')
    show = false;
  if (props.typeFilter === 'Audio' && props.type !== 'audio')
    show = false;
  if (props.typeFilter === 'Image' && props.type !== 'image')
    show = false;
  if (!show) return;
  let mediaExt = '.mp4';
  if (props.type === 'audio') mediaExt = '.mp3';
  if (props.type === 'image') mediaExt = '.jpg';
  return (
    <Link href={'/media/' + props.file.split(mediaExt)[0]}>
      <div className={multimediaStyles.activityItem}>
        <div
          style={{
            width: '192px',
            overflow: 'clip',
            background: 'rgba(255, 255, 255, 0.6)',
            zIndex: 999,
          }}
        >
          {props.name}
        </div>
        <Image
          className={multimediaStyles.imageThumb}
          src={'/classvideolibrary/thumbs/' + props.thumb}
          // width={props.size.w > 0 ? props.size.w : 192}
          // height={props.size.h > 0 ? props.size.h : 108}
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
        className={multimediaStyles.tagPillHighlighted}
        key={props.tag}
        onClick={() => props.onClick()}
      >
        {props.tag}
      </div>
    );
  return (
    <div
      className={multimediaStyles.tagPill}
      key={props.tag}
      onClick={() => props.onClick()}
    >
      {props.tag}
    </div>
  );
};

export default function Page() {
  const media = library.mediafiles;
  const [currentMediaFilters, setCurrentMediaFilters] = useState<
    string[]
  >([]);

  const selectTag = (tag: string) => {
    if (currentMediaFilters.includes(tag)) {
      setCurrentMediaFilters(
        currentMediaFilters.filter((tg) => tg !== tag)
      );
      return;
    }
    setCurrentMediaFilters([...currentMediaFilters, tag]);
  };

  const [inputFilter, setInputFilter] = useState<string>('');
  const changeInputFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setInputFilter(e.target.value);
  };

  const [inputTypeFilter, setInputTypeFilter] =
    useState<string>('All Media');
  const changeInputTypeFilter = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(e.target.value);
    setInputTypeFilter(e.target.value);
  };

  const filterTypeOptions = ['All Media', 'Video', 'Audio', 'Image'];

  return (
    <div className={multimediaStyles.main}>
      <div className={multimediaStyles.filterPane}>
        <div>
          <Link href="/">
            <Image
              src={NavArrow}
              width={100}
              height={100}
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
        <h1>Filter By Type:</h1>
        <select
          className={multimediaStyles.filterTypeDropDown}
          onChange={changeInputTypeFilter}
        >
          {filterTypeOptions.map((option) => (
            <option
              key={option}
              className={multimediaStyles.filterTypeOption}
            >
              {inputTypeFilter === option && <>{'\u2714'}</>} {option}
            </option>
          ))}
        </select>
        <h1>Filter By Tag:</h1>
        <input
          className={multimediaStyles.filterInput}
          value={inputFilter}
          onChange={() => changeInputFilter}
        ></input>
        <div className={multimediaStyles.tagContainer}>
          {library.tags.sort().map((tag) => (
            <FilteredTag
              key={tag}
              tag={tag}
              selected={currentMediaFilters}
              onClick={() => selectTag(tag)}
              inputFilter={inputFilter}
            />
          ))}
          <FilteredTag
            tag={'UNTAGGED'}
            selected={currentMediaFilters}
            onClick={() => selectTag('UNTAGGED')}
            inputFilter={inputFilter}
          />
        </div>
      </div>
      <div className={multimediaStyles.contentPane}>
        <h1 style={{ color: 'black' }}>Multimedia</h1>
        <div className={multimediaStyles.videoList}>
          {media.map((vid) => (
            <MediaLink
              key={vid.name}
              name={vid.name}
              // folder={vid.folder}
              file={vid.file}
              tags={vid.tags}
              // key={vid.name}
              thumb={vid.thumb}
              selected={currentMediaFilters}
              typeFilter={inputTypeFilter}
              type={vid.type}
              size={vid.size ? vid.size : { w: 0, h: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
