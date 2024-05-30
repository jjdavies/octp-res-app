import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import builderStyles from '../styles/Builder.module.css';
import Link from 'next/link';
import DataContext from './DataContext';
import StageThumb from './StageThumb';
import Image from 'next/image';
import ResourceThumb from './ResourceThumb';
import Action from '../interfaces/actionSystem/Action';
import ActionsVisual from './ActionsVisual';
import { v4 as uuidv4 } from 'uuid';
import Trigger from '../interfaces/actionSystem/Trigger';
import ActivityResource from '../interfaces/ActivityResource';

interface FormModuleProps {
  formModuleEvent: Function;
  actionTriggerData?: Trigger[];
}

const CreateActionWindow = (props: FormModuleProps) => {
  return (
    <div>
      <div className={builderStyles.formBlock}>
        <button
          className={builderStyles.formButton}
          onClick={() => props.formModuleEvent('Add Trigger')}
        >
          Add a Trigger
        </button>
      </div>
      <div className={builderStyles.formBlock}>
        <button
          className={builderStyles.formButton}
          onClick={() => props.formModuleEvent('Add Result')}
        >
          Add Result
        </button>
      </div>
      <div className={builderStyles.formBlock}>
        <button className={builderStyles.formButton}>
          Timeline Options
        </button>
      </div>
    </div>
  );
};

const SelectTriggerType = (props: FormModuleProps) => {
  return (
    <div>
      <div className={builderStyles.formBlock}>
        <button
          className={builderStyles.formButton}
          onClick={() => props.formModuleEvent('Resource Event')}
        >
          Resource Event Trigger
        </button>
        <button
          className={builderStyles.formButton}
          onClick={() => props.formModuleEvent('Activity Event')}
        >
          Activity Event Trigger
        </button>
        <button
          className={builderStyles.formButton}
          onClick={() => props.formModuleEvent('Existing Action')}
        >
          Existing Action Event Trigger
        </button>
      </div>
    </div>
  );
};

const SetupResourceTrigger = (props: FormModuleProps) => {
  const { data, currentStageID } = useContext(DataContext);
  const stage = data?.stages.filter(
    (stg) => stg.stageID === currentStageID
  )[0];
  const resources = stage?.activitySettings.resources;

  const resourceTriggerTypeOptions = [
    'Click',
    'Multi Choice - Correct',
    'Multi Choice - Incorrect',
    'Start Drag',
    'Stop Drag',
    'Drag Target - Correct',
    'Drag Target - Incorrect',
  ];
  const [selectedTriggerType, setSelectedTriggerType] =
    useState<string>('');
  const [selectedResource, setSelectedResource] =
    useState<string>('');

  const resourceSelectHandler = (props: {
    res: ActivityResource;
    trigger?: Trigger;
  }) => {
    setSelectedResource(props.res.resourceID);
  };

  const changeTriggerTypeSelection = (e) => {
    setSelectedTriggerType(e.target.value);
  };
  return (
    <div className={builderStyles.formBlock}>
      {resources && resources.length > 0
        ? 'Select a resource...'
        : 'No Resources'}
      <div className={builderStyles.selectResourceThumbs}>
        <>
          {resources &&
            resources.map((res) => (
              <ResourceThumb
                onClick={resourceSelectHandler}
                selectedResource={selectedResource}
                res={res}
              />
            ))}
        </>
      </div>

      <div className={builderStyles.resourceTriggerType}>
        {selectedResource !== '' && (
          <select
            className={builderStyles.resourceTriggerTypeSelect}
            value={selectedTriggerType}
            onChange={(e) => changeTriggerTypeSelection(e)}
          >
            <option>None</option>
            {resourceTriggerTypeOptions.map((typ) => (
              <option
                className={
                  builderStyles.resourceTriggerTypeSelectOption
                }
              >
                {typ}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        className={builderStyles.formButton}
        onClick={() =>
          props.formModuleEvent('Accept Resource Event Trigger', {
            resID: selectedResource,
            triggerType: selectedTriggerType,
          })
        }
      >
        Accept
      </button>
      <button
        className={builderStyles.formButton}
        onClick={() =>
          props.formModuleEvent('Cancel Resource Event Trigger')
        }
      >
        Cancel
      </button>
    </div>
  );
};

const SetupResult = (props: FormModuleProps) => {
  return (
    <div className={builderStyles.formBlock}>
      <button
        className={builderStyles.formButton}
        onClick={() =>
          props.formModuleEvent('Resource Animation Result')
        }
      >
        Resource Animation Result
      </button>
      <button
        className={builderStyles.formButton}
        onClick={() => props.formModuleEvent('Media Result')}
      >
        Media Result
      </button>
      <button
        className={builderStyles.formButton}
        onClick={() => props.formModuleEvent('Activity Result')}
      >
        Activity Result
      </button>
    </div>
  );
};

const SetupResourceAnimationResult = (props: FormModuleProps) => {
  const { data, currentStageID } = useContext(DataContext);
  const stage = data?.stages.filter(
    (stg) => stg.stageID === currentStageID
  )[0];
  const resources = stage?.activitySettings.resources;

  const resourcePropertyOptions = ['Opacity', 'Position', 'Rotation'];
  const resourcePropertyValueOptions = [
    { property: 'Opacity', options: ['%'] },
    { property: 'Position', options: ['px', '%'] },
    { property: 'Rotation', options: ['deg'] },
  ];

  const [selectedResource, setSelectedResource] =
    useState<string>('');
  const [selectedTriggerType, setSelectedTriggerType] =
    useState<string>('None');
  const [selectedProperty, setSelectedProperty] =
    useState<string>('None');
  const [selectedValueType, setSelectedValueType] =
    useState<string>('Actual Value');
  const [actualValue, setActualValue] = useState<string>('');
  const [inputValueValid, setInputValueValid] =
    useState<boolean>(true);

  const [validUniqueTriggers, setValidUniqueTriggers] = useState<
    Trigger[]
  >([]);

  console.log(props);

  //determine if a single trigger type exist (click, dragdown dragup, dragstop, dragcorrect, dragincorrect, MCcorrect, MCincorrect)
  //ensure a single trigger exists for that trigger type
  const validTypes = [
    'Click',
    'Multi Choice - Correct',
    'Multi Choice - Incorrect',
    'Start Drag',
    'Stop Drag',
    'Drag Target - Correct',
    'Drag Target - Incorrect',
  ];

  const [
    selectedTriggerEventResource,
    setSelectedTriggerEventResource,
  ] = useState<Trigger>();

  useEffect(() => {
    const validTriggers = props.actionTriggerData
      ? props.actionTriggerData.filter(
          (trig) => validTypes.indexOf(trig.trigger.event) !== -1
        )
      : [];
    console.log('valid triggers', validTriggers);
    const validTriggerTypes: String[] = validTriggers.map((trig) => {
      return trig.trigger.event;
    });
    console.log('validtriggertypes', validTriggerTypes);
    //valid trigger types that have multiple triggers of that type
    const nonUniqueValidTriggerTypes = validTriggerTypes.map(
      (trigtype, index) => {
        if (validTriggerTypes.indexOf(trigtype) !== index) {
          //not first instance of that trigger type
          return trigtype;
        }
      }
    );
    console.log('nonunique', nonUniqueValidTriggerTypes);
    //finalize array of valid unique triggers
    setValidUniqueTriggers(
      validTriggers.filter(
        (trig) =>
          nonUniqueValidTriggerTypes.indexOf(trig.trigger.event) ===
          -1
      )
    );
    console.log(resources, validUniqueTriggers);
    // const validUniqueTriggers =
    //   validTriggers.length === 0
    //     ? []
    //     : validTriggers.filter(
    //         (trig) => nonUniqueValidTriggerTypes.indexOf(trig.type) === -1,
    //       );
  }, [props.actionTriggerData]);

  const resourceSelectHandler = (props: {
    res: ActivityResource;
    trigger?: Trigger;
  }) => {
    console.log(props);
    if (props.trigger) {
      setSelectedResource('');
      return setSelectedTriggerEventResource(props.trigger);
    }
    setSelectedTriggerEventResource(undefined);
    setSelectedResource(props.res.resourceID);
  };

  const changePropertySelection = (e) => {
    setSelectedProperty(e.target.value);
    // validate(actualValue, e.target.value);
  };

  const changeValueType = (e) => {
    setSelectedValueType(e.target.value);
  };

  // const validate = (value: string, property: string) => {
  //   let valid = false;
  //   const options = resourcePropertyValueOptions.filter(
  //     (prop) => prop.property === property,
  //   )[0].options;
  //   options.map((option) => {
  //     const valueEnd = value.substring(
  //       value.length - option.length,
  //       value.length,
  //     );
  //     console.log(valueEnd, option);
  //     if (valueEnd === option) valid = true;
  //   });
  //   setInputValueValid(valid);
  // };

  const changeActualValue = (e) => {
    setActualValue(e.target.value as string);
    if (selectedProperty === 'None') {
      return;
    }
    // validate(e.target.value, selectedProperty);
  };
  return (
    <div className={builderStyles.formBlock}>
      {resources && resources.length > 0
        ? 'Select a resource...'
        : 'No Resources'}
      <div className={builderStyles.selectResourceThumbs}>
        <>
          {resources &&
            validUniqueTriggers.length !== 0 &&
            validUniqueTriggers.map((trig) => (
              <>
                <ResourceThumb
                  onClick={resourceSelectHandler}
                  selectedResource={selectedResource}
                  res={
                    data.stages
                      .filter(
                        (stg) => stg.stageID === currentStageID
                      )[0]
                      .activitySettings.resources.filter(
                        (res) =>
                          res.resourceID === trig.trigger.resourceID
                      )[0]
                  }
                  caption={trig.trigger.event}
                  trigger={trig}
                  selectedTriggerEvent={
                    selectedTriggerEventResource?.id
                  }
                />
              </>
            ))}
        </>

        {resources &&
          resources.map((res) => (
            <ResourceThumb
              onClick={resourceSelectHandler}
              selectedResource={selectedResource}
              res={res}
            />
          ))}
      </div>

      <div className={builderStyles.resourceTriggerType}>
        {(selectedResource !== '' ||
          selectedTriggerEventResource) && (
          <div className={builderStyles.formFlex}>
            <div className={builderStyles.formBlock}>
              <label htmlFor="resourcePropertySelect">Property</label>
              <select
                className={builderStyles.resourceTriggerTypeSelect}
                value={selectedProperty}
                onChange={changePropertySelection}
              >
                <option
                  className={
                    builderStyles.resourcePropertySelectOption
                  }
                >
                  None
                </option>
                {resourcePropertyOptions.map((typ) => (
                  <option
                    className={
                      builderStyles.resourcePropertySelectOption
                    }
                  >
                    {typ}
                  </option>
                ))}
              </select>
            </div>
            {selectedProperty !== 'None' && (
              <div className={builderStyles.formBlock}>
                <label htmlFor="valueTypeSelect">Value Type</label>
                <select
                  id="valueTypeSelect"
                  className={builderStyles.resourceTriggerTypeSelect}
                  value={selectedValueType}
                  onChange={changeValueType}
                >
                  {/* <option
                    className={builderStyles.resourcePropertySelectOption}
                  >
                    None
                  </option> */}
                  <option
                    className={
                      builderStyles.resourcePropertySelectOption
                    }
                  >
                    Actual Value
                  </option>
                  <option
                    className={
                      builderStyles.resourcePropertySelectOption
                    }
                  >
                    Relative Value
                  </option>
                </select>
              </div>
            )}
            {selectedValueType === 'Actual Value' && (
              <div className={builderStyles.formBlock}>
                {selectedProperty === 'None' ? (
                  <label htmlFor="resourcePropertySelect">
                    Value
                  </label>
                ) : (
                  <label htmlFor="resourcePropertySelect">
                    Value (
                    {resourcePropertyValueOptions
                      .filter(
                        (prop) => prop.property === selectedProperty
                      )[0]
                      .options.map((op, index) => (
                        <>
                          {index !== 0 ? '/ ' : ''}
                          {op}
                        </>
                      ))}
                    )
                  </label>
                )}
                <input
                  className={builderStyles.resourceTriggerValueInput}
                  type="text"
                  value={actualValue}
                  onChange={changeActualValue}
                  style={{
                    border: inputValueValid
                      ? '3px solid green'
                      : '3px solid red',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {actualValue !== '' && inputValueValid && (
        <button
          className={builderStyles.formButton}
          onClick={() =>
            props.formModuleEvent(
              'Accept Resource Animation Result',
              {
                resID: selectedResource,
                triggerEventRes: selectedTriggerEventResource,
                property: selectedProperty,
                valueType: selectedValueType,
                value: actualValue,
              }
            )
          }
        >
          Accept
        </button>
      )}
      <button
        className={builderStyles.formButton}
        onClick={() =>
          props.formModuleEvent('Cancel Resource Animation Result')
        }
      >
        Cancel
      </button>
    </div>
  );
};

export default function ActionsWindow() {
  const { data, currentStageID, saveAction, addTrigger, addResult } =
    useContext(DataContext);
  const initialActionID = uuidv4();
  const [currentSettingAction, setCurrentSettingAction] =
    useState<Action>({
      id: initialActionID,
      triggers: [],
      conditions: [],
      results: [],
    });

  const [selectedAction, setSelectedAction] =
    useState<string>(initialActionID);
  const [settingStages, setSettingStages] = useState<string[]>([]);

  const formModuleEvent = (event: string, data?: any) => {
    switch (event) {
      case 'Add Trigger':
        setSettingStages([...settingStages, event]);
        break;
      case 'Resource Event':
        setSettingStages([...settingStages, event]);
        break;
      case 'Activity Event':
        setSettingStages([...settingStages, event]);
        break;
      case 'Existing Action':
        setSettingStages([...settingStages, event]);
        break;
      case 'Accept Resource Event Trigger':
        //return to first stage
        setSettingStages([]);
        //set the trigger data
        //set on the current setting action
        if (currentSettingAction.id === selectedAction) {
          return setCurrentSettingAction({
            ...currentSettingAction,
            triggers: [
              ...currentSettingAction.triggers,
              {
                id: uuidv4(),
                type: 'ResourceTrigger',
                trigger: {
                  stageID: currentStageID,
                  resourceID: data.resID,
                  event: data.triggerType,
                },
              },
            ],
          });
        }
        addTrigger(selectedAction, {
          type: 'ResourceTrigger',
          trigger: {
            id: uuidv4(),
            stageID: currentStageID,
            resourceID: data.resID,
            event: data.triggerType,
          },
        });
        break;
      case 'Cancel Resource Event Trigger':
        //return to first stage
        setSettingStages([]);
        break;
      case 'Add Result':
        setSettingStages([...settingStages, event]);
        break;
      case 'Resource Animation Result':
        setSettingStages([...settingStages, event]);
        break;
      case 'Accept Resource Animation Result':
        //return to first stage
        setSettingStages([]);
        //set the result data
        //set on the current setting action
        if (currentSettingAction.id === selectedAction) {
          console.log('accept', [
            ...currentSettingAction.results,
            {
              id: uuidv4(),
              type: 'Resource Animation Result',
              result: {
                triggerEventRes: data.resID ? false : true,
                resourceID:
                  data.resID !== ''
                    ? data.resID
                    : data.triggerEventRes,
                property: data.property,
                valueType: data.valueType,
                value: { value: data.value },
              },
            },
          ]);
          return setCurrentSettingAction({
            ...currentSettingAction,
            results: [
              ...currentSettingAction.results,
              {
                id: uuidv4(),
                type: 'Resource Animation Result',
                result: {
                  resourceID: data.resID,
                  property: data.property,
                  valueType: data.valueType,
                  value: { value: data.value },
                },
              },
            ],
          });
        }
        // console.log('no return --> change');
        addResult(selectedAction, {
          type: 'Resource Animation Result',
          result: {
            resourceID: data.resID,
            property: data.property,
            valueType: data.valueType,
            value: { value: data.value },
          },
        });
        break;
      case 'Cancel Resource Animation Result':
        //return to first stage
        setSettingStages([]);
        break;
    }
  };

  const pillClick = (setting: string) => {
    //clear future stages
    if (setting === 'Create Action') {
      //return to first stage
      return setSettingStages([]);
    }
    setSettingStages([
      ...settingStages.slice(0, settingStages.indexOf(setting) + 1),
    ]);
    //clear data from cleared stages
  };

  const acceptAction = () => {
    saveAction(currentSettingAction);
    const id = uuidv4();
    setCurrentSettingAction({
      id: id,
      triggers: [],
      results: [],
      conditions: [],
    });
    setSelectedAction(id);
  };

  const clearAction = () => {
    const id = uuidv4();
    setCurrentSettingAction({
      id: id,
      triggers: [],
      results: [],
      conditions: [],
    });
    setSelectedAction(id);
  };

  const selectAction = (id: string) => {
    setSelectedAction(id);
  };

  const deleteTriggerHandler = (
    actionID: string,
    triggerID: string
  ) => {
    setCurrentSettingAction({
      ...currentSettingAction,
      triggers: currentSettingAction.triggers.filter(
        (trig) => trig.id !== triggerID
      ),
    });
  };

  const deleteResultHandler = (
    actionID: string,
    resultID: string
  ) => {
    setCurrentSettingAction({
      ...currentSettingAction,
      results: [],
    });
  };

  return (
    <div className={builderStyles.actionsWindow}>
      {currentSettingAction.triggers && (
        <ActionsVisual
          partialAction={currentSettingAction}
          selectedActionID={selectedAction}
          selectAction={selectAction}
          deleteTrigger={(actID: string, triggerID: string) =>
            deleteTriggerHandler(actID, triggerID)
          }
          deleteResult={(actID: string, resultID: string) =>
            deleteResultHandler(actID, resultID)
          }
        />
      )}
      <div className={builderStyles.actionsSetupPills}>
        <a
          className={builderStyles.pill}
          onClick={() => pillClick('Create Action')}
        >
          &gt; Create Action &gt;
        </a>
        {settingStages.map((setting) => (
          <a
            className={builderStyles.pill}
            onClick={() => pillClick(setting)}
          >
            {setting} &gt;{' '}
          </a>
        ))}
      </div>
      <div className={builderStyles.actionsSetup}>
        {settingStages.length === 0 && (
          <>
            <CreateActionWindow formModuleEvent={formModuleEvent} />
            {currentSettingAction.triggers.length > 0 &&
              currentSettingAction.results.length > 0 && (
                <>
                  <button
                    className={builderStyles.formButton}
                    onClick={acceptAction}
                  >
                    Save Action
                  </button>
                </>
              )}
            <button
              className={builderStyles.formButton}
              onClick={clearAction}
            >
              Clear Action
            </button>
          </>
        )}
        {settingStages[settingStages.length - 1] ===
          'Add Trigger' && (
          <SelectTriggerType formModuleEvent={formModuleEvent} />
        )}
        {settingStages[settingStages.length - 1] ===
          'Resource Event' && (
          <SetupResourceTrigger formModuleEvent={formModuleEvent} />
        )}
        {settingStages[settingStages.length - 1] === 'Add Result' && (
          // Form Module for adding a result to the action
          // Send the current setting action triggers OR
          // ... send the saved action triggers
          <SetupResult formModuleEvent={formModuleEvent} />
        )}
        {settingStages[settingStages.length - 1] ===
          'Resource Animation Result' && (
          <SetupResourceAnimationResult
            formModuleEvent={formModuleEvent}
            actionTriggerData={
              currentSettingAction.id === selectedAction
                ? currentSettingAction.triggers
                : data?.actions.filter(
                    (action) => action.id === selectedAction
                  )[0].triggers
            }
          />
        )}
      </div>
    </div>
  );
}
