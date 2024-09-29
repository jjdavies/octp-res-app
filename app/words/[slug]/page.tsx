'use client';
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import useSound from 'use-sound';

import Banana from '../img/banana.png';
import Heart from '../img/heart.png';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import words from '../../styles/WordsVis.module.css';

import AudioButton from '../../img/buttons/playaudio.png';
import Loading from '../../img/icons/pending.gif';

import {
  createClient,
  ErrorResponse,
  PaginationParams,
  Photo,
  Photos,
  PhotosWithTotalResults,
} from 'pexels';
import { isPhotos } from 'pexels/dist/typeCheckers';

interface Element {
  id: number;
  type: string;
}

interface WordElement {
  id: number;
  type: string;
  word: string;
  audio: string;
}

interface Definition {
  id: number;
  wordType: string;
  definition: string;
}

interface DefinitionElement extends Element {
  word: string;
  definitions: Definition[];
}

interface ImageElement extends Element {
  image: string | StaticImport | null;
}

interface PhoneticElement extends Element {
  phoneme: string;
}

interface BoxedElement {
  id: number;
  type: string;
  contents:
    | WordElement
    | DefinitionElement
    | ImageElement
    | PhoneticElement;
}

interface BoxedElementProps {
  elData: BoxedElement;
  space: MutableRefObject<HTMLDivElement>;
  canvas: MutableRefObject<HTMLCanvasElement>;
  image: string;
  changeWord: Function;
}

const BoxedElementComp = (props: BoxedElementProps) => {
  const audioClipRef = useRef(null);
  const inputRef = useRef(null);
  let data = null;
  if (props.elData.type === 'main_word') {
    data = props.elData.contents as WordElement;
  }
  const [currentWordValue, setCurrentWordValue] = useState(
    data ? data.word : ''
  );
  const [centerPoints, setCenterPoints] = useState({ x: 0, y: 0 });
  const [containerSpace, setContainerSpace] = useState({
    w: 0,
    h: 0,
  });
  const [mainWordEdit, setMainWordEdit] = useState<boolean>(false);

  useEffect(() => {
    const containerSpaceRect =
      props.space.current !== null
        ? props.space.current.getBoundingClientRect()
        : null;
    if (containerSpaceRect) {
      console.log(containerSpaceRect);
      setCenterPoints({
        x: containerSpaceRect.left + containerSpaceRect.width / 2,

        y: containerSpaceRect.top + containerSpaceRect.height / 2,
      });
      setContainerSpace({
        w: containerSpaceRect.width,
        h: containerSpaceRect.height,
      });
    }
  }, [props.space]);

  if (props.elData.type === 'main_word') {
    const data = props.elData.contents as WordElement;
    const word = data.word;
    const positionX = centerPoints.x - 30;
    const positionY = centerPoints.y - 20;

    const playAudioClip = () => {
      if (audioClipRef.current !== null) {
        const audioClip =
          audioClipRef.current as unknown as HTMLAudioElement;
        audioClip.play();
      }
    };

    const mainWordClick = (e: MouseEvent<HTMLDivElement>) => {
      const { target } = e;
      const targetID = (target as HTMLDivElement).id;
      if (targetID !== 'audioClipImg') {
        setMainWordEdit(true);
        if (inputRef !== null && inputRef.current !== null) {
          const input =
            inputRef.current as unknown as HTMLInputElement;
          input.select();
        }
      }
    };

    const changeWordValue = (e: ChangeEvent<HTMLInputElement>) => {
      setCurrentWordValue(e.target.value);
    };

    const keyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        props.changeWord(currentWordValue);
      }
    };

    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: centerPoints.y,
            width: '100%',
            opacity: mainWordEdit ? 1 : 0,
          }}
        >
          <input
            className={words.wordInput}
            value={currentWordValue}
            onChange={(e) => changeWordValue(e)}
            onKeyDown={(e) => keyPress(e)}
            ref={inputRef}
          />
        </div>
        {!mainWordEdit && (
          <div
            className={words.boxedElement}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              left: positionX,
              top: positionY,
              fontSize: '40px',
            }}
            onClick={(e) => mainWordClick(e)}
          >
            <div>{word}</div>
            <div>
              <div
                id="audioClipDiv"
                style={{ position: 'relative', margin: '0 2px' }}
                onClick={() => playAudioClip()}
              >
                ++
                <Image
                  id="audioClipImg"
                  src={AudioButton}
                  fill
                  objectFit="contain"
                  alt="audio button"
                />
              </div>
            </div>
            <audio src={data.audio} ref={audioClipRef} />
          </div>
        )}
      </div>
    );
  }
  if (props.elData.type === 'definitions') {
    const data = props.elData.contents as DefinitionElement;
    const definitions = data.definitions;
    const numOfActiveDefs = 6;
    const defRange = [0, 5];
    const distanceFromWord = 100;
    const availableSpace = containerSpace.w * 0.9;
    const divisions = definitions.length < 6 ? definitions.length : 6;
    const dividedSpace = availableSpace / divisions;
    const centerDef = centerPoints.x;
    let positionX = centerPoints.x;
    let positionY = centerPoints.y + distanceFromWord;
    if (props.canvas.current) {
      const ctx = props.canvas.current.getContext('2d');
      if (ctx) {
        definitions.map((def, index) => {
          if (index >= defRange[0] && index <= defRange[1]) {
            ctx.moveTo(centerPoints.x, centerPoints.y);

            ctx.lineTo(
              centerDef +
                dividedSpace * (index - divisions / 2) +
                dividedSpace / 2,
              centerPoints.y + 100
            );

            ctx.stroke();
          }
        });
      }
    }
    // const wordTypeBG =

    return (
      <div className={words.definitionsElement}>
        {definitions.map((def, index) => (
          <div key={def.definition}>
            {index >= defRange[0] && index <= defRange[1] && (
              <>
                <div
                  className={words.boxedElement}
                  style={{
                    left:
                      centerDef +
                      dividedSpace * (index - divisions / 2),
                    top: positionY,
                    maxWidth: dividedSpace * 0.9,
                  }}
                >
                  <div
                    className={def.wordType}
                    style={{
                      background:
                        def.wordType === 'noun'
                          ? 'lightblue'
                          : def.wordType === 'verb'
                          ? 'lightgreen'
                          : 'lightpurple',
                    }}
                  >
                    {def.wordType}
                  </div>
                  {def.definition}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (props.elData.type === 'image_element') {
    const imageData = props.elData.contents as ImageElement;
    if (props.canvas.current) {
      const ctx = props.canvas.current.getContext('2d');
      if (ctx) {
        ctx.moveTo(centerPoints.x, centerPoints.y);
        ctx.lineTo(centerPoints.x + 200, centerPoints.y - 300);
        ctx.stroke();
      }
    }
    return (
      <div
        className={words.boxedElement}
        style={{
          left: centerPoints.x + 200,
          top: centerPoints.y - 300,
        }}
      >
        <Image
          src={props.image === '' ? Loading : props.image}
          height={200}
          width={150}
          alt="image"
          draggable="false"
        />
      </div>
    );
  }
  if (props.elData.type === 'phonetic_element') {
    const phonData = props.elData.contents as PhoneticElement;
    if (props.canvas.current) {
      const ctx = props.canvas.current.getContext('2d');
      if (ctx) {
        ctx.moveTo(centerPoints.x, centerPoints.y);
        ctx.lineTo(centerPoints.x - 150, centerPoints.y - 200);
        ctx.stroke();
      }
    }
    return (
      <div
        className={words.boxedElement}
        style={{
          left: centerPoints.x - 150,
          top: centerPoints.y - 200,
          fontSize: '35px',
        }}
      >
        {phonData.phoneme}
      </div>
    );
  }
};

interface PageProps {
  params: { slug: string };
}

export default function Page(props: PageProps) {
  const slug = props.params.slug;
  const client = createClient(
    `${process.env.NEXT_PUBLIC_PEXELS_KEY}`
  );
  const containerSpaceRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [elements, setElements] = useState<BoxedElement[]>([]);
  const [image, setImage] = useState('');
  useEffect(() => {
    if (props.params) return;
    if (elements && elements.length === 0) {
      setElements([
        {
          id: 1,
          type: 'main_word',
          contents: {
            id: 1,
            type: 'main_word',
            word: 'type a word...',
            audio: '',
          },
        },
      ]);
    }
  }, [elements]);

  useEffect(() => {
    if (props.params) {
      changeWord(props.params.slug);
    }
  }, []);
  // const [elements, setElements] = useState<BoxedElement[]>([
  //   {
  //     id: 1,
  //     type: 'main_word',
  //     contents: {
  //       id: 1,
  //       type: 'main_word',
  //       word: 'heart',
  //       audio:
  //         'https://api.dictionaryapi.dev/media/pronunciations/en/heart-uk.mp3',
  //     },
  //   },
  //   {
  //     id: 2,
  //     type: 'definitions',
  //     contents: {
  //       id: 1,
  //       word: 'heart',
  //       type: 'definitions',
  //       definitions: [
  //         {
  //           id: 1,
  //           wordType: 'noun',
  //           definition:
  //             'A muscular organ that pumps blood through the body, traditionally thought to be the seat of emotion.',
  //         },
  //         {
  //           id: 2,
  //           wordType: 'noun',
  //           definition:
  //             'Emotions, kindness, moral effort, or spirit in general.',
  //         },
  //         {
  //           id: 3,
  //           wordType: 'noun',
  //           definition:
  //             'The seat of the affections or sensibilities, collectively or separately, as love, hate, joy, grief, courage, etc.; rarely, the seat of the understanding or will; usually in a good sense; personality.',
  //         },
  //         {
  //           id: 4,
  //           wordType: 'noun',
  //           definition: 'Courage; courageous purpose; spirit.',
  //         },
  //         {
  //           id: 5,
  //           wordType: 'noun',
  //           definition:
  //             'Vigorous and efficient activity; power of fertile production; condition of the soil, whether good or bad.',
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     id: 3,
  //     type: 'image_element',
  //     contents: { id: 1, type: 'image/png', image: Heart },
  //   },
  //   {
  //     id: 3,
  //     type: 'phonetic_element',
  //     contents: { id: 1, type: 'phonetic', phoneme: '/hɑːt/' },
  //   },
  // ]);

  useEffect(() => {
    const containerSpaceRect =
      containerSpaceRef.current !== null
        ? containerSpaceRef.current.getBoundingClientRect()
        : null;
    if (containerSpaceRect) {
      if (canvasRef.current) {
        canvasRef.current.width = containerSpaceRect.width;
        canvasRef.current.height = containerSpaceRect.height;
      }
    }
  }, []);

  const changeWord = (word: string) => {
    console.log(word);
    setElements([]);
    setImage('');
    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.reset();
    }
    //get new word
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    ).then(async (res) => {
      const json = await res.json();
      const newElements = [];
      newElements.push({
        id: 1,
        type: 'main_word',
        contents: {
          id: 1,
          type: 'main_word',
          word: word,
          audio: json[0].phonetics[0].audio,
        },
      });
      newElements.push({
        id: 2,
        type: 'phonetic_element',
        contents: {
          id: 1,
          type: 'phonetic_element',
          phoneme: json[0].phonetics[0].text,
        },
      });
      let definitions: Definition[] = [];
      json[0].meanings.map((meaningType: any) => {
        meaningType.definitions.map((meaning: any) => {
          definitions.push({
            id: 1,
            wordType: meaningType.partOfSpeech,
            definition: meaning.definition,
          });
        });
      });
      newElements.push({
        id: 1,
        type: 'definitions',
        contents: {
          id: 1,
          type: 'definitions',
          word: word,
          definitions: [...definitions],
        },
      });

      newElements.push({
        id: 1,
        type: 'image_element',
        contents: {
          id: 1,
          type: 'image/png',
          image: 'loading',
        },
      });

      console.log(newElements);

      setElements([...newElements]);

      if (json[0].meanings.length > 0) {
        //populate meanings
        // setWordData({
        //   ...wordData,
        //   meanings: [...json[0].meanings],
        //   examples: [0],
        //   synonyms: [0],
        // });
      }
    });

    client.photos
      .search({ query: word, per_page: 1 })
      .then((photos) => {
        const photosRes: PhotosWithTotalResults | ErrorResponse =
          photos;
        const photosCollection = (photos as PhotosWithTotalResults)
          .photos;
        setImage(photosCollection[0].src.small);
        // setElements(
        //   elements.map((el) => {
        //     if (el.type === 'image_element') {
        //       return {
        //         ...el,
        //         contents: {
        //           ...el.contents,
        //           image: photos.photos[0].src.small,
        //         },
        //       };
        //     }
        //     return el;
        //   })
        // );
        // setElements([
        //   ...elements,
        //   {
        //     id: 1,
        //     type: 'image_element',
        //     contents: {
        //       id: 1,
        //       type: 'image/png',
        //       image: photos.photos[0].src.small,
        //     },
        //   },
        // ]);
      });
  };
  return (
    <div className={words.container} ref={containerSpaceRef}>
      <canvas ref={canvasRef} />
      {elements.map((el) => (
        <BoxedElementComp
          key={el.id}
          elData={el}
          space={
            containerSpaceRef as MutableRefObject<HTMLDivElement>
          }
          canvas={canvasRef as MutableRefObject<HTMLCanvasElement>}
          image={image}
          changeWord={(word: string) => changeWord(word)}
        />
      ))}
    </div>
  );
}
