import Image from 'next/image';
import React, { useContext, useState } from 'react';
import builderStyles from '../styles/Builder.module.css';

import ResetWhite from '../img/icons/white_reset.svg';
import TickWhite from '../img/icons/white_tick.svg';
import DataContext from './DataContext';
import AnswerSymbol from './AnswerSymbol';

interface GameControlProps {
  match: boolean;
}

export default function GameControl(props: GameControlProps) {
  const { matchAttempts, resetMatchAttempts } =
    useContext(DataContext);
  const [showMatchAnswers, setShowMatchAnswers] =
    useState<boolean>(false);

  const checkMatches = () => {
    setShowMatchAnswers(true);
  };
  return (
    <div>
      {props.match && (
        <div className={builderStyles.matchControlContainer}>
          <Image
            src={ResetWhite}
            alt="reset symbol"
            onClick={() => resetMatchAttempts()}
          />
          <div
            style={{
              width: '5px',
              height: '80%',
              background: 'white',
              borderRadius: '5px',
            }}
          ></div>
          <Image
            src={TickWhite}
            alt="tick symbol"
            onClick={checkMatches}
          />
        </div>
      )}
      {props.match &&
        showMatchAnswers &&
        matchAttempts.map((attempt) => (
          <>
            <AnswerSymbol attempt={attempt} />
          </>
        ))}
    </div>
  );
}
