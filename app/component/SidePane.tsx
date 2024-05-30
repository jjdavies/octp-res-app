import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import builderStyles from '../styles/Builder.module.css';

import Thumb from './Thumb';
import Clip from './Clip';

import AudioFile from '../interfaces/AudioFile';

interface SidePaneProps {
  thumbDrop: Function;
  clipDrop: Function;
}

export default function SidePane(props: SidePaneProps) {
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const handleChange = (files: FileList) => {
    console.log(files.length, files);
    var newImgs: string[] = [];
    var newAuds: AudioFile[] = [];
    for (var i: number = 0; i < files.length; i++) {
      console.log(files[i].name.split('.').pop());
      if (files[i].type.split('/')[0] === 'audio')
        newAuds.push({
          name: files[i].name.split('.')[0],
          url: URL.createObjectURL(files[i]),
          format: files[i].name.split('.').pop(),
        });
      if (files[i].type.split('/')[0] === 'image')
        newImgs.push(URL.createObjectURL(files[i]));
    }
    setImageFiles([...imageFiles, ...newImgs]);
    setAudioFiles([...audioFiles, ...newAuds]);
  };

  const thumbDrop = (rect: DOMRect, imgURL: string) => {
    console.log(rect);
    props.thumbDrop(rect, imgURL);
  };

  const clipDrop = (rect: DOMRect, audioFile: AudioFile) => {
    props.clipDrop(rect, audioFile);
  };

  return (
    <div className={builderStyles.leftPane}>
      <div className={builderStyles.fileUploader}>
        <FileUploader
          handleChange={handleChange}
          children={
            <div className={builderStyles.sidePaneFileDrop}>
              Drag files here.
              <br /> Or click to add.
            </div>
          }
          multiple
        />
      </div>
      <div className={builderStyles.imagesList}>
        {imageFiles.map((fil) => (
          <Thumb key={fil} src={fil} thumbDrop={thumbDrop} />
        ))}
        {audioFiles.map((fil) => (
          <Clip key={fil.name} audioFile={fil} clipDrop={clipDrop} />
        ))}
      </div>
    </div>
  );
}
