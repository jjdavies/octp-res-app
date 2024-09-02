'use client';
import React, { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import library from '../../mediafiles.json';
import Image from 'next/image';
import NavArrow from '../../img/buttons/navArrow.svg';
import AddButton from '../../img/buttons/add.svg';
import multimediaStyles from '../../styles/Multimedia.module.css';
import { saveJson } from '../savefile';

interface PageProps {
  params: { slug: string };
}

export default function Page(props: PageProps) {
  const slug = props.params.slug;
  const media = library.mediafiles;
  console.log(decodeURIComponent(slug));
  console.log(media[0].file);
  const [data, setData] = useState(
    // media.filter(
    //   (media) => media.file.split('.mp4')[0] === decodeURIComponent(slug)
    // )[0]
    media.filter((media) => {
      let mediaExt = '.mp4';
      if (media.type === 'audio') mediaExt = '.mp3';
      if (media.type === 'image') mediaExt = '.jpg';
      if (media.file.split(mediaExt)[0] === decodeURIComponent(slug))
        return true;
      return false;
    })[0]
  );
  const allTags = library.tags.filter(
    (tag) => !data.tags.includes(tag)
  );
  const [modal, setModal] = useState(false);

  const [newTagValue, setNewTagValue] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);

  const newTagValueChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewTagValue(e.target.value);
  };

  const showModal = () => {
    setModal(true);
  };

  const deleteTag = (delTag: string) => {
    setData({
      ...data,
      tags: data.tags.filter((tag) => tag !== delTag),
    });
    setNewTags(newTags.filter((tag) => tag !== delTag));
  };

  const cancelTags = () => {
    setData(
      media.filter(
        (vid) =>
          vid.file.split('.mp4')[0] === decodeURIComponent(slug)
      )[0]
    );

    setModal(false);
  };

  const addNewTag = (tagToAdd: string) => {
    addTag(tagToAdd);
    setNewTagValue('');
    if (library.tags.includes(tagToAdd)) return;
    if (newTags.includes(tagToAdd)) return;
    setNewTags([...newTags, tagToAdd]);
  };

  const addTag = (tagToAdd: string) => {
    setData({ ...data, tags: [...data.tags, tagToAdd] });
  };

  const saveTags = async () => {
    const newJson = {
      tags: [...library.tags, ...newTags],
      videofiles: library.mediafiles.map((vid) => {
        if (vid.file.split('.mp4')[0] === decodeURIComponent(slug)) {
          return { ...vid, tags: data.tags };
        }
        return vid;
      }),
    };
    //save json
    saveJson(newJson);
    setNewTags([]);
  };

  const newTagEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      addNewTag(newTagValue);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        background: 'rgba(50, 50, 50)',
      }}
    >
      <div>
        <Link href="/media">
          <Image
            src={NavArrow}
            width={200}
            height={200}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(180deg)',
              zIndex: 600,
            }}
            alt="nav arrow"
          />
        </Link>
      </div>
      <div style={{ textAlign: 'center' }} onClick={showModal}>
        <Image
          src={AddButton}
          width={150}
          height={150}
          style={{
            position: 'absolute',
            top: 200,
            left: 0,
            zIndex: 400,
            cursor: 'pointer',
          }}
          alt="add"
        />
      </div>
      {/* media */}
      {data && (
        <>
          {data.type === 'video' && (
            <video
              src={`/classvideolibrary/${slug}.mp4`}
              style={{
                height: '90vh',
                marginTop: '2.5%',
                filter: 'drop-shadow(1,1,1,white)',
              }}
              autoPlay
              controls={true}
            />
          )}
          {data.type === 'audio' && (
            <audio
              src={`/classvideolibrary/audio/${slug}.mp3`}
              style={{
                height: '90vh',
                marginTop: '2.5%',
                filter: 'drop-shadow(1,1,1,white)',
              }}
              autoPlay
              controls={true}
            />
          )}
          {data.type === 'image' && (
            <>
              {data.size && (
                <div className={multimediaStyles.imageContainer}>
                  <Image
                    className={multimediaStyles.mediaImage}
                    src={`/classvideolibrary/image/${slug}.jpg`}
                    alt="image"
                    width={data.size.w}
                    height={data.size.h}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
      {modal && (
        <div className={multimediaStyles.modalTagContainer}>
          <div className={multimediaStyles.modalTags}>
            <h1>Tags</h1>
            New Tag:{' '}
            <div style={{ display: 'flex' }}>
              <input
                className={multimediaStyles.tagInput}
                value={newTagValue}
                onChange={() => newTagValueChanged}
                onKeyDown={() => newTagEnter}
              ></input>
              <button
                className={multimediaStyles.newTagButton}
                onClick={() => addNewTag(newTagValue)}
              >
                Add
              </button>
            </div>
            <div className={multimediaStyles.tagContainer}>
              {data.tags.sort().map((tag) => (
                <div className={multimediaStyles.tagPill} key={tag}>
                  {tag}
                  <span style={{ padding: '0 5px' }}>|</span>
                  <div
                    className={multimediaStyles.deleteTag}
                    onClick={() => deleteTag(tag)}
                  >
                    &#x274c;
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                borderRadius: '1px',
                position: 'relative',
                width: '95%',
                height: '2px',
                background: 'gray',
                margin: '20px',
              }}
            ></div>
            <div
              className={multimediaStyles.tagContainer}
              style={
                {
                  // position: 'relative',
                  // top: '50%',
                }
              }
            >
              {allTags.sort().map((tag) => (
                <div
                  className={multimediaStyles.tagPill}
                  key={tag}
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div className={multimediaStyles.modalButtons}>
              <div
                className={multimediaStyles.modalCancel}
                onClick={cancelTags}
              >
                Cancel
              </div>
              <div
                className={multimediaStyles.modalSave}
                onClick={saveTags}
              >
                Save
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
