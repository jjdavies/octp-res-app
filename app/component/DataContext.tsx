import { createContext, ReactNode, useState } from 'react';
import Action from '../interfaces/Action';
import Activity from '../interfaces/NewActivity';
import MatchAttempt from '../interfaces/MatchAttempt';

interface DataProviderState {
  data: Activity | null;
  setInitialData: Function;
  matchSelect: string;
  selectNewMatch: Function;
  matchAttempts: MatchAttempt[];
  resetMatchAttempts: Function;
  currentStageID: string;
  navigateRight: Function;
  triggerAction: Function;
  triggerActions: Function;
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext({} as DataProviderState);

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<Activity | null>(null);
  const [matchSelect, setMatchSelect] = useState<string>('');
  const [matchAttempts, setMatchAttempts] = useState<MatchAttempt[]>(
    []
  );
  const [currentStageID, setCurrentStageID] =
    useState<string>('id001');
  const [navDebounce, setNavDebounce] = useState<boolean>(false);

  const selectNewMatch = (resID: string) => {
    const resource = data?.stages
      .filter((stg) => stg.stageID === currentStageID)[0]
      .activitySettings.resources.filter(
        (res) => res.resourceID === resID
      )[0];
    if (resource?.resourceSettings.zPosType === 'BACK') {
      //selected resource is background so should not be selected
      return setMatchSelect('');
    }
    //check if one side of match already made and set if not
    if (matchSelect === '') return setMatchSelect(resID);
    //prevent match to self
    if (matchSelect === resID) return setMatchSelect('');
    //make new match attempt
    setMatchAttempts([
      ...matchAttempts,
      { a: matchSelect, b: resID },
    ]);
    return setMatchSelect('');
  };

  const resetMatchAttempts = () => {
    setMatchAttempts([]);
  };

  const setInitialData = (initialData: Activity) => {
    console.log(initialData);
    setData(initialData);
  };

  const navigateRight = () => {
    console.log('nav');
    if (navDebounce) return;
    if (data) {
      setNavDebounce(true);
      setTimeout(() => {
        setNavDebounce(false);
      }, 100);
      if (data?.setup.stages.length < 2) return;
      if (
        data.setup.stages.indexOf(currentStageID) ===
        data.setup.stages.length - 1
      )
        return setCurrentStageID(data.setup.stages[0]);
      setCurrentStageID(
        data.setup.stages[
          data.setup.stages.indexOf(currentStageID) + 1
        ]
      );
    }
  };

  const triggerActions = (actions: Action[]) => {
    console.log(actions);
    var results = actions.map((action) => {
      if (action.results[0].type === 'Resource Animation Result') {
        console.log(action.results[0].result);
        return action.results[0].result;
      }
    });
    //assign value as actual value if value type is 'actual value' type
    const animations = results.map((result) => {
      return {
        resourceID: result.resourceID,
        property: result.property.toLowerCase(),
        value:
          result.valueType === 'Actual Value'
            ? result.value.value
            : 0,
      };
    });
    console.log(animations);
    //find relevant resources (those with results)
    const relevantResources = animations.map((anim) => {
      return anim.resourceID;
    });
    //remove duplicates
    const uniqueRelevantResources = relevantResources.filter(
      (resID, index) => {
        console.log(resID, index, relevantResources.indexOf(resID));
        return relevantResources.indexOf(resID) === index
          ? true
          : false;
      }
    );
    //make an animation object for each resource (combine animations if resource has multiple)
    const animationObjects = uniqueRelevantResources.map((res) => {
      let animation = {
        resourceID: res,
        animations: [],
      };
      animations.map((anim) => {
        if (anim.resourceID === res) {
          console.log(anim.value);
          animation = {
            ...animation,
            animations: [
              ...animation.animations,
              { property: anim.property, value: anim.value },
            ],
          };
          console.log(animation);
        }
        // return animation;
      });
      return animation;
    });

    if (data) {
      setData({
        ...data,
        stages: data.stages.map((stage) => {
          if (stage.stageID === currentStageID) {
            return {
              ...stage,
              activitySettings: {
                ...stage.activitySettings,
                resources: stage.activitySettings.resources.map(
                  (res) => {
                    if (
                      relevantResources.indexOf(res.resourceID) !== -1
                    ) {
                      return {
                        ...res,
                        resourceSettings: {
                          ...res.resourceSettings,
                          animations: [
                            // ...res.resourceSettings.animations,
                            ...animationObjects
                              .filter(
                                (animObj) =>
                                  animObj.resourceID ===
                                  res.resourceID
                              )
                              .map((a) => a.animations)[0],
                          ],
                        },
                      };
                    }
                    return res;
                  }
                ),
              },
            };
          }
          return stage;
        }),
      });
    }
  };

  const triggerAction = (action: Action) => {
    console.log(action);
    if (action.results[0].type === 'Resource Animation Result') {
      var result = action.results[0].result;
      const animation = {
        ...result,
        value: result.value.value,
        // value: 0,
        property: result.property.toLowerCase(),
      };

      if (data) {
        setData({
          ...data,
          stages: data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: stage.activitySettings.resources.map(
                    (res) => {
                      if (res.resourceID === animation.resourceID) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            animation: animation,
                          },
                        };
                      }
                      return res;
                    }
                  ),
                },
              };
            }
            return stage;
          }),
        });
      }
    }
    // switch (action.action) {
    //   case 'disappear':
    //   case 'appear':
    //     if (data) {
    //       setData({
    //         ...data,
    //         stages: data.stages.map((stage) => {
    //           if (stage.stageID === currentStageID) {
    //             return {
    //               ...stage,
    //               activitySettings: {
    //                 ...stage.activitySettings,
    //                 resources: stage.activitySettings.resources.map((res) => {
    //                   if (res.resourceID === action.target) {
    //                     return {
    //                       ...res,
    //                       resourceSettings: {
    //                         ...res.resourceSettings,
    //                         visible: action.action === 'appear' ? true : false,
    //                       },
    //                     };
    //                   }
    //                   return res;
    //                 }),
    //               },
    //             };
    //           }
    //           return stage;
    //         }),
    //       });
    //     }
    //     break;
    //   case 'fadeIn':
    //   case 'fadeOut':
    //     console.log(action);
    //     if (data) {
    //       setData({
    //         ...data,
    //         stages: data.stages.map((stage) => {
    //           if (stage.stageID === currentStageID) {
    //             return {
    //               ...stage,
    //               activitySettings: {
    //                 ...stage.activitySettings,
    //                 resources: stage.activitySettings.resources.map((res) => {
    //                   if (res.resourceID === action.target) {
    //                     return {
    //                       ...res,
    //                       resourceSettings: {
    //                         ...res.resourceSettings,
    //                         animation: action.animation,
    //                       },
    //                     };
    //                   }
    //                   return res;
    //                 }),
    //               },
    //             };
    //           }
    //           return stage;
    //         }),
    //       });
    //     }
    // }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setInitialData,
        matchSelect,
        selectNewMatch,
        matchAttempts,
        resetMatchAttempts,
        currentStageID,
        navigateRight,
        triggerAction,
        triggerActions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
