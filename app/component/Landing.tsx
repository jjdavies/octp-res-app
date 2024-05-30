import Image from 'next/image';
import React, { use, useState } from 'react';
import builderStyles from '../styles/Builder.module.css';

import builderButton from '../img/buttons/build-button.svg';
import playButton from '../img/buttons/play-button.svg';
import editButton from '../img/buttons/edit-button.svg';
import Link from 'next/link';

interface LandingProps {
  availableActivities: [];
  sessionModeSelect: Function;
}

export default function Landing(props: LandingProps) {
  const [builderModeButton, setBuilderModeButton] =
    useState<boolean>(true);
  const [
    landingActivitySelectionMode,
    setLandingActivitySelectionMode,
  ] = useState<string>('none');

  console.log('data', props.availableActivities);

  const availableActivities = props.availableActivities;

  const builderSelect = () => {
    props.sessionModeSelect('builder_edit');
  };

  const startActivity = () => {
    setLandingActivitySelectionMode('play');
    setBuilderModeButton(false);
  };

  const editActivity = () => {
    setLandingActivitySelectionMode('edit');
    setBuilderModeButton(false);
  };

  const activitySelect = (name: string) => {
    if (landingActivitySelectionMode === 'play') {
      props.sessionModeSelect('player', name);
    }
    if (landingActivitySelectionMode === 'edit') {
      props.sessionModeSelect('edit', name);
    }
  };

  return (
    <div className={builderStyles.landingContainer}>
      <div className={builderStyles.landingButtons}>
        {builderModeButton && (
          <div className={builderStyles.landingButtonContainer}>
            <Link href={'/local/builder'}>
              <div className={builderStyles.landingButton}>
                <Image
                  className={builderStyles.landingIcon}
                  src={builderButton}
                  alt="Builder Mode Button"
                />
                <div className={builderStyles.landingButtonText}>
                  Use the Builder to prepare materials.
                </div>
              </div>
            </Link>
          </div>
        )}
        <div
          className={builderStyles.landingButtonContainer}
          onClick={editActivity}
        >
          <div className={builderStyles.landingButton}>
            <Image
              className={builderStyles.landingIcon}
              src={editButton}
              alt="Edit Mode Button"
            />
            <div className={builderStyles.landingButtonText}>
              Edit a prepared activity!
            </div>
          </div>
        </div>
        <div
          className={builderStyles.landingButtonContainer}
          onClick={startActivity}
        >
          <div className={builderStyles.landingButton}>
            <Image
              className={builderStyles.landingIcon}
              src={playButton}
              alt="Play Mode Button"
            />
            <div className={builderStyles.landingButtonText}>
              Start a prepared activity!
            </div>
          </div>
        </div>
        {!builderModeButton && (
          <div className={builderStyles.activityListContainer}>
            <div className={builderStyles.landingActivityList}>
              {availableActivities.map((activity) => (
                <Link
                  href={
                    landingActivitySelectionMode === 'edit'
                      ? 'local/builder/' + activity.name
                      : 'local/' + activity.name
                  }
                >
                  <div
                    className={builderStyles.landingActivity}
                    // onClick={() => activitySelect(activity.name)}
                  >
                    {activity.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
