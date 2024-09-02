import React, {
  MouseEventHandler,
  useEffect,
  useState,
  useContext,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import Head from 'next/head';

import Activity from '../interfaces/NewActivity';

import CanvasSpace from './CanvasSpace';
import SidePane from './SidePane';
import TopPane from './TopPane';
import ActionsWindow from './ActionsWindow';

import builderStyles from '../styles/Builder.module.css';
import ContentResource from '../interfaces/ContentResource';
import ActivityResource from '../interfaces/ActivityResource';

import DataContext, { DataProvider } from './DataContext';

import bringToFront from '../img/buttons/bringToFront.svg';
import sendToBack from '../img/buttons/sendToBack.svg';
import deleteImage from '../img/buttons/deleteImage.svg';
import offlineSave from '../img/buttons/offlineSave.svg';
import assignCorrect from '../img/buttons/assignCorrect.svg';
import assignIncorrect from '../img/buttons/assignIncorrect.svg';

import AudioFile from '../interfaces/AudioFile';
import allofflineData from '../activityfiles.json';
import Image from 'next/image';

interface BuilderProps {
  data: Activity | null;
}

const buttons = [
  {
    name: 'bringToFront',
    icon: bringToFront,
    group: 'format',
    action: 'bringToFront',
    activeReqs: ['imageSelected'],
  },
  {
    name: 'sendToBack',
    icon: sendToBack,
    group: 'format',
    action: 'sendToBack',
    activeReqs: ['imageSelected'],
  },
  {
    name: 'deleteImage',
    icon: deleteImage,
    group: 'format',
    action: 'deleteImage',
    activeReqs: ['imageSelected'],
  },
  {
    name: 'lockImage',
    group: 'format',
    action: 'lockImage',
    activeReqs: ['imageSelected'],
  },
  {
    name: 'visible',
    group: 'format',
    action: 'visible',
    activeReqs: ['imageSelected'],
  },
  {
    name: 'setDraggers',
    group: 'dragging',
    action: 'setDraggers',
    activeReqs: [],
  },
  {
    name: 'setDropPosition',
    group: 'dragging',
    action: 'setDropPosition',
    activeReqs: [],
  },
  {
    name: 'setConnection',
    group: 'setup',
    action: 'setConnection',
    activeReqs: [],
  },
  {
    name: 'assignCorrect',
    icon: assignCorrect,
    group: 'setup',
    action: 'assignCorrect',
    activeReqs: [],
  },
  {
    name: 'assignIncorrect',
    icon: assignIncorrect,
    group: 'setup',
    action: 'assignIncorrect',
    activeReqs: [],
  },
  {
    name: 'actionsPaneButton',
    group: 'setup',
    action: 'actionsPaneButton',
    activeReqs: [],
  },
  {
    name: 'options',
    group: 'tools',
    action: 'options',
    activeReqs: [],
  },
  {
    name: 'offlineSave',
    icon: offlineSave,
    group: 'file',
    action: 'offlineSave',
    activeReqs: [],
  },
];

export default function Builder(props: BuilderProps) {
  console.log('builder render', props);

  const [canvasRect, setCanvasRect] = useState<DOMRect>();
  const [thumbRect, setThumbRect] = useState<DOMRect>();
  // const [viewScale, setViewScale] = useState(50);

  const changeViewScale = (change: number) => {
    setViewScale(+viewScale * change);
  };

  const [modalSaveFilename, setModalSaveFilename] =
    useState<string>('');

  const [valid, setValid] = useState<boolean>(false);

  const changeModalSaveFilename = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setModalSaveFilename(e.currentTarget.value);
    //check for valid activity name
    const activities = allofflineData.activities;
    const existingAct = activities.filter((act) => {
      if (act.name === e.currentTarget.value + '.json') {
        return true;
      }
      return false;
    });
    if (existingAct.length > 0 || e.currentTarget.value === '') {
      return setValid(false);
    }
    return setValid(true);
  };

  const [modalSaveTag, setModalSaveTag] = useState<string>('');

  const changeModalSaveTag = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    setModalSaveTag(e.currentTarget.value);
  };

  const [selectedTagOption, setSelectedTagOption] =
    useState<string>('');

  const tagOptionClicked = (tag: string) => {
    if (selectedTagOption === tag) {
      //remove
      return setSelectedTagOption('');
    }
    setSelectedTagOption(tag);
  };

  const saveFromModalHandler = () => {
    if (valid) saveFromModal(modalSaveFilename, selectedTagOption);
  };

  const {
    data,
    setData,
    setInitialData,
    setBlankData,
    selectedImage,
    selectImage,
    addImageToData,
    addAudioToData,
    viewScale,
    setViewScale,
    updateThumb,
    actionsPaneActive,
    showModalSaveWindow,
    cancelModalSave,
    saveFromModal,
  } = useContext(DataContext);

  useEffect(() => {
    console.log('builder useeffect');
    if (data !== null) {
      return setInitialData(props.data);
    }
    setBlankData();
  }, [props.data]);

  const thumbDrop = (rect: DOMRect, imgURL: string) => {
    if (canvasRect) {
      if (rect.x > canvasRect.x) {
        console.log(rect);
        //add the img to the canvas data
        addImageToData(imgURL, rect);
      }
    }
  };

  const clipDrop = (rect: DOMRect, audioFile: AudioFile) => {
    if (canvasRect) {
      if (rect.x > canvasRect.x) {
        //add the audio clip to the canvas data
        addAudioToData(audioFile, rect);
      }
    }
  };

  const canvasRectCB = (rect: DOMRect) => {
    setCanvasRect(rect);
  };

  const handleSpaceClick = (
    e: React.MouseEvent<Element, MouseEvent>
  ) => {
    const { target } = e;
    const { id } = target as HTMLElement;
    if (id === 'canvasSpace') {
      selectImage('');
    }
  };

  const cancelSaveModal = () => {
    cancelModalSave();
  };

  return (
    <div>
      <Head>
        <title>Builder</title>
        <meta
          name="description"
          content="Educational Activities Prototype"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={builderStyles.container}
        onClick={handleSpaceClick}
      >
        <TopPane buttons={buttons} />
        <SidePane thumbDrop={thumbDrop} clipDrop={clipDrop} />
        {actionsPaneActive ? (
          <ActionsWindow />
        ) : (
          <CanvasSpace
            viewScale={viewScale}
            changeViewScale={changeViewScale}
            canvasRectCB={canvasRectCB}
          />
        )}
      </div>
      {showModalSaveWindow && (
        <div className={builderStyles.modalSaveWindow}>
          <div className={builderStyles.modalSaveWindowForm}>
            <h2>Save Activity</h2>
            <div>
              <label htmlFor="activityname">Activity Name: </label>
              <input
                className={builderStyles.modalSaveWindowFormInput}
                id="activityname"
                type="text"
                value={modalSaveFilename}
                onChange={changeModalSaveFilename}
                style={{ background: valid ? 'lightgreen' : 'pink' }}
              ></input>
              {valid && (
                <span style={{ color: 'green' }}>{'\u2714'}</span>
              )}
              {!valid && (
                <span style={{ color: 'red' }}>{'\u2718'}</span>
              )}
            </div>
            <div>
              <label htmlFor="activityTag">Activity Tag: </label>
              <div className={builderStyles.tagOptions}>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BF1'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BF1')}
                >
                  BF1
                </div>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BF2'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BF2')}
                >
                  BF2
                </div>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BF3'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BF3')}
                >
                  BF3
                </div>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BE1'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BE1')}
                >
                  BE1
                </div>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BE2'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BE2')}
                >
                  BE2
                </div>
                <div
                  className={`${builderStyles.tagOption} ${
                    selectedTagOption === 'BE3'
                      ? builderStyles.tagClicked
                      : ''
                  }`}
                  onClick={() => tagOptionClicked('BE3')}
                >
                  BE3
                </div>
              </div>
            </div>
            <div>
              <button
                className={`${builderStyles.modalButton}  ${builderStyles.cancelButton}`}
                onClick={cancelSaveModal}
              >
                Cancel
              </button>
              <button
                className={`${builderStyles.modalButton}  ${builderStyles.saveButton}`}
                onClick={saveFromModalHandler}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
