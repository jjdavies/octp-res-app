// 'use client';
// import React, {
//   ChangeEvent,
//   KeyboardEvent,
//   MouseEvent,
//   useRef,
//   useState,
// } from 'react';
// import wordsStyles from '../styles/Words.module.css';
// import { a, animated, useSpring } from '@react-spring/web';
// import Image from 'next/image';

// import DefinitionIcon from '../img/icons/definition.svg';
// import ExampleIcon from '../img/icons/example.svg';
// import SynonymIcon from '../img/icons/synonym.svg';
// import { useDrag } from '@use-gesture/react';

// interface wordDataProps {
//   word: string;
//   meanings: [];
//   examples: [];
//   synonyms: [];
// }

// interface WordElementProps {
//   content: string;
//   type: string;
//   wordDataAvailable: boolean;
//   wordData: wordDataProps;
//   x: number;
//   y: number;
// }

// const WordElement = (props: WordElementProps) => {
//   const wordElSprings = useSpring({
//     from: { x: -100, y: 150, scale: 0.6 },
//     to: { x: 0, y: 0, scale: 1 },
//   });
//   const iconSprings = useSpring({
//     from: { x: -100, y: 150, scale: 0.6 },
//     to: { x: 0, y: 0, scale: 1 },
//   });

//   const [options, setOptions] = useState(false);
//   const [definitions, setDefinitions] = useState(false);
//   const [definitionsData, setDefinitionsData] = useState();

//   const clickElement = (e: MouseEvent<HTMLDivElement>) => {
//     setOptions(true);
//   };

//   const showDefinitions = () => {
//     setDefinitionsData(props.wordData.meanings);
//     setDefinitions(true);
//   };
//   const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }));
//   const bind = useDrag(({ active, movement: [x, y] }) => {
//     api.start({
//       x: x,
//       y: y,
//       scale: 1,
//     });
//   });
//   return (
//     <a.div {...bind()} style={style}>
//       <div
//         className={wordsStyles.currentWord}
//         style={{ left: props.x, top: props.y }}
//         onClick={(e) => clickElement(e)}
//       >
//         <>
//           {props.content}
//           {props.wordDataAvailable === false && <>...</>}
//         </>
//         {/* {options && (
//           <div className={wordsStyles.icons}>
//             {props.wordData.meanings.length > 0 && (
//               <animated.div
//                 style={{
//                   ...wordElSprings,
//                 }}
//                 onClick={() => showDefinitions()}
//               >
//                 <div className={wordsStyles.icon}>
//                   <Image
//                     src={DefinitionIcon}
//                     width={100}
//                     height={100}
//                     alt="def icon"
//                   />
//                   {definitions && <div>↓</div>}
//                 </div>
//               </animated.div>
//             )}
//             {props.wordData.examples &&
//               props.wordData.examples.length > 0 && (
//                 <animated.div style={{ ...wordElSprings }}>
//                   <Image
//                     src={ExampleIcon}
//                     width={100}
//                     height={100}
//                     alt="eg icon"
//                   />
//                 </animated.div>
//               )}
//             {props.wordData.synonyms &&
//               props.wordData.synonyms.length > 0 && (
//                 <animated.div style={{ ...wordElSprings }}>
//                   <Image
//                     src={SynonymIcon}
//                     width={100}
//                     height={100}
//                     alt="synonym icon"
//                   />
//                 </animated.div>
//               )}
//           </div>
//         )} */}
//       </div>
//     </a.div>
//   );
// };

// export default function Page() {
//   //refs
//   const wordInputRef = useRef<HTMLInputElement | null>(null);
//   const mainSpaceRef = useRef<HTMLDivElement | null>(null);

//   //state
//   const [wordInputValue, setWordInputValue] = useState<string>('');
//   const [currentWord, setCurrentWord] = useState<string>('');
//   const [wordElements, setWordElements] = useState<
//     WordElementProps[] | null
//   >([]);
//   const [wordDataAvailable, setWordDataAvailable] =
//     useState<boolean>(false);
//   const [wordData, setWordData] = useState({
//     word: '',
//     meanings: [],
//   });
//   const [originalData, setOriginalData] = useState();

//   const wordInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
//     console.log(e.currentTarget.value);
//     setWordInputValue(e.currentTarget.value);
//   };

//   const selectWordInput = () => {
//     if (wordInputRef === null || wordInputRef.current === null)
//       return;
//     wordInputRef.current.select();
//   };

//   const wordInputKeyDown = (e: KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       acceptWord(wordInputValue);
//     }
//   };

//   const acceptWord = (word: string) => {
//     let x = 0;
//     let y = 0;
//     // console.log(mainSpaceRef);
//     // if (mainSpaceRef !== null && mainSpaceRef.current !== null) {
//     //   const mainSpaceRect =
//     //     mainSpaceRef.current?.getBoundingClientRect();
//     //   console.log(mainSpaceRect);
//     //   x = mainSpaceRect
//     //     ? mainSpaceRect.width / 2 -
//     //       word.length * (mainSpaceRect.width * 0.019)
//     //     : 0;
//     //   y = mainSpaceRect ? mainSpaceRect.height / 2 : 0;
//     //   console.log(x, y);
//     // }
//     setWordData({ word: '', meanings: [] });
//     setCurrentWord(word);
//     setWordElements([{ content: word, type: 'focus', x, y }]);
//     getWordData(word);
//   };

//   const getWordData = async (word: string) => {
//     fetch(
//       `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
//     ).then(async (res) => {
//       const json = await res.json();
//       setWordDataAvailable(true);
//       setOriginalData(json);
//       if (json[0].meanings.length > 0) {
//         //populate meanings
//         setWordData({
//           ...wordData,
//           meanings: [...json[0].meanings],
//           examples: [0],
//           synonyms: [0],
//         });
//       }
//     });
//   };
//   return (
//     <div className={wordsStyles.container}>
//       <div className={wordsStyles.contents}>
//         <div className={wordsStyles.topBar}>
//           <input
//             className={wordsStyles.wordInput}
//             type="text"
//             value={wordInputValue}
//             onChange={(e) => wordInputValueChange(e)}
//             onClick={() => selectWordInput()}
//             onKeyDown={(e) => wordInputKeyDown(e)}
//             ref={wordInputRef}
//           ></input>
//           <button
//             className={wordsStyles.acceptButton}
//             onClick={() => acceptWord(currentWord)}
//           >
//             OK
//           </button>
//         </div>
//         <div className={wordsStyles.mainSpace} ref={mainSpaceRef}>
//           {wordElements !== null && (
//             <>
//               {wordElements.map((el) => (
//                 <WordElement
//                   key={el.content}
//                   content={el.content}
//                   type={el.type}
//                   wordDataAvailable={wordDataAvailable}
//                   wordData={wordData}
//                   x={el.x}
//                   y={el.y}
//                 />
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
