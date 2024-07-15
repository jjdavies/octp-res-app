import {
  Context,
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Activity from '../interfaces/NewActivity';
import ActivityStage from '../interfaces/ActivityStage';

import ContentResource from '../interfaces/ContentResource';
import ActivityResource from '../interfaces/ActivityResource';
import AudioFile from '../interfaces/AudioFile';
import html2canvas from 'html2canvas';
import Action from '../interfaces/actionSystem/Action';
import Condition from '../interfaces/actionSystem/Condition';
import CreateNewAction from './actions/CreateNewAction';
import AddTrigger from './actions/AddTrigger';

import { saveFromModalSrvr } from './saveActivityFile';

import axios from 'axios';

import allofflineData from '../activityfiles.json';

import fsPromises from 'fs/promises';

const defaultValue = {};

const eventActionWindowSystem = [
  {
    id: 'create-new-action',
    component: CreateNewAction,
    prompt: 'Create New Action',
    pill: 'Action',
    childComponents: [
      {
        id: 'select-trigger',
        component: AddTrigger,
        format: 'button',
      },
    ],
  },
];

interface DataProviderState {
  data: Activity | null;
  setData: Function;
  setInitialData: Function;

  viewScale: number;
  setViewScale: Function;

  actionsPaneActive: boolean;
  actionsPaneSelect: Function;

  stagesPaneActive: boolean;
  stagesPaneSelect: Function;

  currentStageID: string;
  setBlankData: Function;
  selectedImage: string;
  selectImage: Function;
  updateImageData: Function;
  bringToFront: Function;
  sendToBack: Function;
  addImageToData: Function;
  deleteImageFromData: Function;
  lockImage: Function;
  setVisible: Function;
  addAudioToData: Function;

  settingDraggersActive: boolean;
  setDraggers: Function;
  settingConnectionActive: boolean;
  setConnection: Function;
  settingDropPositionActive: boolean;
  setDropPosition: Function;
  setDropPositionData: Function;
  connectionNode: string;

  offlineSave: Function;
  setZPosType: Function;
  optionsSelected: Boolean;
  selectOptions: Function;
  resetSelections: Function;
  makeOptionChange: Function;
  settingIncorrect: boolean;
  settingCorrect: boolean;
  setMultiChoiceOption: Function;

  addNewStage: Function;
  goToPreviousStage: Function;
  goToNextStage: Function;
  setStage: Function;
  reOrderStages: Function;
  updateThumb: Function;

  getActivityResource: Function;
  getContentResource: Function;

  saveAction: Function;
  addTrigger: Function;
  addResult: Function;
  deleteTrigger: Function;
  deleteResult: Function;

  setModalSave: Function;
  showModalSaveWindow: boolean;
  saveFromModal: Function;
  cancelModalSave: Function;
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext({} as DataProviderState);

const newResourceSettingsDefault = {
  onCanvas: true,
  draggable: true,
  zPosType: 'MID',
  orderStatus: 'STATIC',
  staticOrder: 1,
  startPosition: '500,300',
  targetPosition: '0,0',
  buildLocked: false,
  special: '',
  multichoice: '',
};

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<Activity | null>(null);
  const [currentStageID, setCurrentStageID] =
    useState<string>('id001');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addedImages, setAddedImages] = useState<ContentResource[]>(
    []
  );
  const [addedAudio, setAddedAudio] = useState<ContentResource[]>([]);
  const [settingCorrect, setSettingCorrect] =
    useState<boolean>(false);
  const [settingIncorrect, setSettingIncorrect] =
    useState<boolean>(false);

  const [actionsPaneActive, setActionsPaneActive] =
    useState<boolean>(false);
  const [stagesPaneActive, setStagesPaneActive] =
    useState<boolean>(false);

  //state for actions
  const [tempActionData, setTempActionData] = useState({
    triggers: [],
    conditions: [],
    results: [],
  });

  //state for connections
  const [connectionNode, setConnectionNode] = useState<string>('');

  //builder modes
  const [settingDraggersActive, setSettingDraggersActive] =
    useState<boolean>(false);
  const [settingDropPositionActive, setSettingDropPositionActive] =
    useState<boolean>(false);
  const [settingConnectionActive, setSettingConnectionActive] =
    useState<boolean>(false);
  const [optionsSelected, setOptionsSelected] =
    useState<boolean>(false);
  const [showModalSaveWindow, setShowModalSaveWindow] =
    useState<boolean>(false);

  const getActivityResource = (resID: string, stageID: string) => {
    const resource = data?.stages
      .filter((stage) => stage.stageID === stageID)[0]
      .activitySettings.resources.filter(
        (res) => res.resourceID === resID
      )[0];
    if (resource) return resource;
    return null;
  };

  const getContentResource = (
    resourceID: string,
    stageID: string
  ): ContentResource | null => {
    const contentRefID = data?.stages
      .filter((stage) => stage.stageID === currentStageID)[0]
      .activitySettings.resources.filter(
        (res) => res.resourceID === resourceID
      )[0].contentRefID;
    if (contentRefID) {
      const content = data.resources.imagesContents.filter(
        (res) => res.contentID === contentRefID
      )[0];
      console.log(content);
      if (content) return content;
    }
    return null;
  };

  const setDraggers = () => {
    setSettingDraggersActive((active) => (active = !active));
  };

  const setDropPosition = () => {
    console.log('data drop', settingDropPositionActive);
    setSettingDropPositionActive((active) => (active = !active));
  };

  const setDropPositionData = (
    id: string,
    pos: { x: number; y: number }
  ) => {
    console.log(id, pos);
    if (data) {
      console.log({
        ...data,
        stages: [
          ...data.stages.map((stg) => {
            if (stg.stageID === currentStageID) {
              return {
                ...stg,
                activitySettings: {
                  ...stg.activitySettings,
                  resources: [
                    stg.activitySettings.resources.map((res) => {
                      console.log(res, id, res.resourceID == id);
                      if (res.resourceID === id) {
                        return {};
                      }
                      // return res;
                    }),
                  ],
                },
              };
            }
            return stg;
          }),
        ],
      });
      setData({
        ...data,
        stages: [
          ...data.stages.map((stg) => {
            if (stg.stageID === currentStageID) {
              return {
                ...stg,
                activitySettings: {
                  ...stg.activitySettings,
                  resources: [
                    ...stg.activitySettings.resources.map((res) => {
                      if (res.resourceID === id) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            targetPosition: `${pos.x},${pos.y}`,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stg;
          }),
        ],
      });
    }
  };

  const setConnection = () => {
    setSelectedImage('');
    setConnectionNode('');
    setSettingConnectionActive((active) => (active = !active));
  };

  const setInitialData = (initialData: Activity) => {
    setData(initialData);
  };

  const [viewScale, setViewScale] = useState(100);

  const getZIndices = () => {
    const currentStage = data
      ? data.stages.map((stage) => {
          if (stage.stageID === currentStageID) return stage;
        })[0]
      : null;
    if (currentStage) {
      const zIndices: number[] | undefined =
        currentStage.activitySettings.resources
          .map((resource) => {
            return resource.resourceSettings.staticOrder;
          })
          .sort(function (a, b) {
            return a - b;
          });

      return zIndices;
    }
    return [5];
  };

  const makeNewConnection = (resID: string) => {
    console.log(resID);
    if (connectionNode === '') {
      //first part of connection
      return setConnectionNode(resID);
    }
    if (connectionNode === resID) {
      //first and second part is the same, reset connection
      return setConnectionNode('');
    }
    //check for identical existing connection
    let identicalConnection = false;
    if (data) {
      data.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .connections.map((ctn) => {
          console.log('connection: ', ctn);
          if (ctn.a === connectionNode || ctn.b === connectionNode) {
            console.log('clash 1');
            if (ctn.a === resID || ctn.b === resID) {
              console.log('clash 2');
              //identical connection exists, reset connection
              identicalConnection = true;
            }
          }
        });
    }
    if (identicalConnection) {
      return setConnectionNode('');
    }
    //save the connection to data
    console.log('saving connection');
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                connections: [
                  ...stage.connections,
                  { a: connectionNode, b: resID },
                ],
              };
            }
            return stage;
          }),
        ],
      });
    }
    setConnectionNode('');
  };

  const resetSelections = () => {
    setSelectedImage('');
    setOptionsSelected(false);
  };

  const setNewDragger = (resID: string) => {
    console.log('dragger');
    if (data) {
      const newValue = !data.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === resID
        )[0].resourceSettings.draggable;
      console.log(newValue);
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === resID) {
                        console.log('resource found', newValue);
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            draggable: newValue,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const setMultiChoiceOption = (name: string) => {
    if (settingConnectionActive || settingDraggersActive) return;
    switch (name) {
      case 'assignCorrect':
        if (settingIncorrect) setSettingIncorrect(false);
        if (settingCorrect) return setSettingCorrect(false);
        setSettingCorrect(true);
        break;
      case 'assignIncorrect':
        if (settingCorrect) setSettingCorrect(false);
        if (settingIncorrect) return setSettingIncorrect(false);
        setSettingIncorrect(true);
        break;
    }
  };

  const selectImage = (resID: string) => {
    if (settingDraggersActive) {
      console.log('setDragger');
      if (resID !== '') setNewDragger(resID);
      return;
    }
    if (settingConnectionActive) {
      if (resID !== '') makeNewConnection(resID);
      return;
    }
    if (settingCorrect || settingIncorrect) {
      if (resID !== '') makeNewMultiChoiceSetting(resID);
      return;
    }
    setSelectedImage(resID);
  };

  const makeNewMultiChoiceSetting = (resID: string) => {
    let resource;
    if (data) {
      resource = data.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === resID
        )[0];
    }
    let currentValue = '';
    if (resource)
      currentValue = resource.resourceSettings.multichoice;
    if (data) {
      currentValue = data.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === resID
        )[0].resourceSettings.multichoice;
    }
    let newValue = '';
    if (settingCorrect)
      newValue = currentValue === 'correct' ? '' : 'correct';
    if (settingIncorrect)
      newValue = currentValue === 'incorrect' ? '' : 'incorrect';
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === resID) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            multichoice: newValue,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const getNewThumb = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      html2canvas(
        document.getElementById('canvasSpace') as HTMLElement
      ).then((canvas) => {
        resolve(canvas.toDataURL('image/png'));
      });
    });
  };

  const updateThumb = async () => {
    const thumb: string = await getNewThumb();
    console.log(typeof thumb);
    if (data) {
      setData({
        ...data,
        stages: data.stages.map((stage) => {
          if (stage.stageID === currentStageID) {
            return {
              ...stage,
              thumb: thumb,
            };
          }
          return stage;
        }),
      });
    }
  };

  const addImageToData = async (imgURL: string, rect: DOMRect) => {
    let imageResource: ContentResource | null;
    //check if imgURL has been added in this session
    if (addedImages?.find((add) => add.localURL === imgURL)) {
      //already added this session
      // console.log('already added');
      // return;
    }
    //set up new content resource
    const newImageResource: ContentResource = {
      contentID: uuidv4(),
      localURL: imgURL,
      format: 'image',
    };
    //get the highest zIndices number to bring the new image to the front
    var zIndices: number[] | undefined = getZIndices();
    zIndices = zIndices ? zIndices : [];
    const largestZIndex =
      zIndices.length > 0 ? zIndices[zIndices.length - 1] : 0;
    //set up new activity resource
    const newActivityResource: ActivityResource = {
      resourceID: uuidv4(),
      contentRefID: newImageResource.contentID,
      style: {
        width: rect.width,
        height: rect.height,
      },
      resourceSettings: {
        ...newResourceSettingsDefault,
        // startPosition: `${(rect.x - 300) * (1 / (viewScale / 100))},${
        startPosition: `${(rect.x - 300) * (viewScale / 100)},${
          // (rect.y - 225) * (1 / (viewScale / 100))
          (rect.y - 125) * (viewScale / 100)
        }`,
        targetPosition: newResourceSettingsDefault.targetPosition,
        staticOrder: largestZIndex + 1,
        zPosType: 'MID',
        special: 'none',
        multichoice: '',
        visible: true,
      },
    };

    //update thumb
    const thumb = await getNewThumb();
    console.log(typeof thumb);
    if (data) {
      setData({
        resources: {
          imagesContents: [
            ...data.resources.imagesContents,
            newImageResource,
          ],
        },
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                thumb: thumb,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources,
                    newActivityResource,
                  ],
                },
              };
            }
            return stage;
          }),
        ],
        setup: {
          ...data.setup,
        },
        actions: data.actions,
        performance: data.performance,
      });
      setAddedImages([...addedImages, newImageResource]);
    }
  };

  const addAudioToData = (audioFile: AudioFile, rect: DOMRect) => {
    const { name, url, format } = audioFile;
    let audioResource: ContentResource | null;
    //check if audio url has been added in this session
    if (addedAudio?.find((add) => add.localURL === url)) {
    }

    //set up new content resource
    const newAudioResource: ContentResource = {
      contentID: uuidv4(),
      localURL: url,
      format: format,
    };
    //get the highest zIndices number to bring the new image to the front
    var zIndices: number[] | undefined = getZIndices();
    zIndices = zIndices ? zIndices : [];
    const largestZIndex =
      zIndices.length > 0 ? zIndices[zIndices.length - 1] : 0;
    const newActivityResource: ActivityResource = {
      resourceID: uuidv4(),
      contentRefID: newAudioResource.contentID,
      style: {
        width: rect.width,
        height: rect.height,
      },
      resourceSettings: {
        ...newResourceSettingsDefault,
        startPosition: `${(rect.x - 300) * (1 / (viewScale / 100))},${
          (rect.y - 225) * (1 / (viewScale / 100))
        }`,
        targetPosition: newResourceSettingsDefault.targetPosition,
        staticOrder: largestZIndex + 1,
        visible: true,
      },
    };
    if (data) {
      setData({
        ...data,
        resources: {
          imagesContents: [
            ...data.resources.imagesContents,
            newAudioResource,
          ],
        },
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  resources: [
                    ...stage.activitySettings.resources,
                    newActivityResource,
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
      setAddedAudio([...addedAudio, newAudioResource]);
    }
  };

  const updateImageData = async (
    id: string,
    pos: { x: number; y: number },
    width: number,
    height: number
  ) => {
    console.log(pos);
    const newPos = `${pos.x},${pos.y}`;
    const thumb = await getNewThumb();
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                thumb: thumb,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID !== id) return res;
                      return {
                        ...res,
                        style: {
                          ...res.style,
                          width,
                          height,
                        },
                        resourceSettings: {
                          ...res.resourceSettings,
                          startPosition: newPos,
                        },
                      };
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
        setup: {
          ...data.setup,
        },
      });
    }
  };

  const deleteImageFromData = () => {
    if (data) {
      console.log(data.stages[0]);
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                connections: stage.connections.filter((ctn) => {
                  if (
                    ctn.a === selectedImage ||
                    ctn.b === selectedImage
                  ) {
                    return false;
                  }
                  return true;
                }),
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.filter(
                      (resource) =>
                        resource.resourceID !== selectedImage
                    ),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
    setSelectedImage('');
  };

  const bringToFront = () => {
    const zIndices: number[] | undefined = getZIndices();
    const largestZIndex: number = zIndices
      ? zIndices[zIndices.length - 1]
      : 0;
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === selectedImage) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            staticOrder: largestZIndex + 1,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const sendToBack = () => {
    const zIndices: number[] | undefined = getZIndices();
    const smallestIndex = zIndices ? zIndices[0] : 0;
    const raiseIndices = smallestIndex < 3 ? 2 : 1;

    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === selectedImage) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            staticOrder: 2,
                          },
                        };
                      }
                      return {
                        ...res,
                        resourceSettings: {
                          ...res.resourceSettings,
                          staticOrder:
                            res.resourceSettings.staticOrder +
                            raiseIndices,
                        },
                      };
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const lockImage = () => {
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === selectedImage) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            buildLocked:
                              !res.resourceSettings.buildLocked,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const setVisible = () => {
    if (data && selectedImage !== '') {
      const currentVisibleValue = data.stages
        .filter((stage) => stage.stageID === currentStageID)[0]
        .activitySettings.resources.filter(
          (res) => res.resourceID === selectedImage
        )[0].resourceSettings.visible;
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
                    if (res.resourceID === selectedImage) {
                      return {
                        ...res,
                        resourceSettings: {
                          ...res.resourceSettings,
                          visible: !currentVisibleValue,
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

  const convertSingleResourceToBase64 = async (
    res: ContentResource
  ) => {
    return new Promise((resolve, reject) => {
      if (res.base64) {
        console.log('has Base64, early return');
        resolve(res);
        return;
      }
      fetch(res.localURL as RequestInfo).then((result) => {
        result.blob().then((blob) => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            res.base64 = reader.result as string;
            resolve(res);
          };
        });
      });
    });
  };

  const convertResourcesToBase64 = async (
    resources: ContentResource[]
  ) => {
    return Promise.all(
      resources.map((res) => convertSingleResourceToBase64(res))
    );
  };

  var encode = function (s: string) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
      out[i] = s.charCodeAt(i);
    }
    return new Uint8Array(out);
  };

  const offlineSave = async (filename: string, tag: string) => {
    // data?.setup.activitySettings.resources.map((res) => console.log(res));
    if (data) {
      const offlineData = {
        ...data,
        resources: {
          ...data?.resources,
          imagesContents: await convertResourcesToBase64(
            data.resources.imagesContents
          ),
        },
      };
      const str = JSON.stringify(offlineData);
      saveFromModal;

      // const dat = encode(str);
      // const blob = new Blob([dat], {
      //   type: 'application/octet-stream',
      // });

      // const element = document.createElement('a');
      // element.href = URL.createObjectURL(blob);
      // element.download = 'export.json';
      // element.click();
    }
  };

  const setZPosType = (resID: string, zPosType: string) => {
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === resID) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            zPosType: zPosType,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const selectOptions = () => {
    if (selectedImage !== '') setOptionsSelected(!optionsSelected);
  };

  class BlankActivity implements Activity {
    resources = {
      imagesContents: [],
    };
    stages = [
      {
        stageID: 'id001',
        activityType: '',
        activityDescription: '',
        connections: [],
        activitySettings: { resources: [] },
      },
    ];
    setup = {
      stages: ['id001'],
    };
    actions: Action[] = [];
    performance: any = null;
  }

  const setBlankData = () => {
    setData(new BlankActivity());
  };

  const addNewStage = (type: string) => {
    setSelectedImage('');
    switch (type) {
      case 'duplicate':
        if (data) {
          const newStageID = uuidv4();
          const newStage = data.stages
            .filter((stg) => {
              if (stg.stageID === currentStageID) {
                return true;
              }
              return false;
            })
            .map((stg) => {
              return {
                ...stg,
                stageID: newStageID,
                activitySettings: {
                  ...stg.activitySettings,
                  resources: [
                    ...stg.activitySettings.resources.map((res) => {
                      return {
                        ...res,
                        resourceID: uuidv4(),
                      };
                    }),
                  ],
                },
              };
            })[0];
          setData({
            ...data,
            stages: [...data.stages, newStage],
            setup: {
              ...data.setup,
              stages: [...data.setup.stages, newStageID],
            },
          });
          setCurrentStageID(newStageID);
        }
        break;
      case 'blank':
        if (data) {
          const newStageID = uuidv4();
          const newStage = {
            stageID: newStageID,
            activityType: '',
            activityDescription: '',
            connections: [],
            activitySettings: { resources: [] },
          };
          setData({
            ...data,
            stages: [...data.stages, newStage],
            setup: {
              ...data.setup,
              stages: [...data.setup.stages, newStageID],
            },
          });
          setCurrentStageID(newStageID);
        }
        break;
    }
  };

  const goToPreviousStage = () => {
    if (data) {
      setSelectedImage('');
      setCurrentStageID(
        data.setup.stages[
          data.setup.stages.indexOf(currentStageID) - 1
        ]
      );
    }
  };

  const goToNextStage = () => {
    if (data) {
      setSelectedImage('');
      setCurrentStageID(
        data.setup.stages[
          data.setup.stages.indexOf(currentStageID) + 1
        ]
      );
    }
  };

  const setStage = (stageID: string) => {
    if (data) {
      setSelectedImage('');
      setCurrentStageID(stageID);
    }
  };

  const makeOptionChange = (key: string, value: string) => {
    console.log('option change', key, value);
    console.log();
    if (data) {
      setData({
        ...data,
        stages: [
          ...data.stages.map((stage) => {
            if (stage.stageID === currentStageID) {
              return {
                ...stage,
                activitySettings: {
                  ...stage.activitySettings,
                  resources: [
                    ...stage.activitySettings.resources.map((res) => {
                      if (res.resourceID === selectedImage) {
                        return {
                          ...res,
                          resourceSettings: {
                            ...res.resourceSettings,
                            [key]: value,
                          },
                        };
                      }
                      return res;
                    }),
                  ],
                },
              };
            }
            return stage;
          }),
        ],
      });
    }
  };

  const actionsPaneSelect = () => {
    setActionsPaneActive((s) => !s);
  };

  const stagesPaneSelect = () => {
    console.log('setting sl');
    setStagesPaneActive((s) => !s);
  };

  const reOrderStages = (stageID: string, positionChange: number) => {
    const movingStage = data?.stages.filter(
      (stage) => stage.stageID === stageID
    )[0];
    if (movingStage === undefined) return;
    const movingStageIndex = data?.stages.indexOf(movingStage);
    if (movingStageIndex === undefined) return;
    const targetStageIndex = movingStageIndex + positionChange;
    if (targetStageIndex === undefined) return;
    const targetStage = data?.stages[targetStageIndex];
    if (targetStage === undefined) return;
    if (data) {
      setData({
        ...data,
        stages: data.stages.map((stage) => {
          if (stage.stageID === stageID) {
            return targetStage;
          }
          if (stage.stageID === targetStage.stageID) {
            return movingStage;
          }
          return stage;
        }),
        setup: {
          ...data.setup,
          stages: data.setup.stages.map((stage) => {
            if (stage === stageID) return targetStage.stageID;
            if (stage === targetStage.stageID) return stageID;

            return stage;
          }),
        },
      });
    }
  };

  // action system
  const saveAction = (action: Action) => {
    if (data) {
      setData({ ...data, actions: [...data.actions, action] });
    }
  };

  const addTrigger = (actionID: string, triggerData: any) => {
    if (data) {
      setData({
        ...data,
        actions: data.actions.map((action) => {
          if (action.id === actionID) {
            return {
              ...action,
              triggers: [...action.triggers, triggerData],
            };
          }
          return action;
        }),
      });
    }
  };

  const addResult = (actionID: string, resultData: any) => {
    if (data) {
      setData({
        ...data,
        actions: data.actions.map((action) => {
          if (action.id === actionID) {
            return {
              ...action,
              results: [...action.results, resultData],
            };
          }
          return action;
        }),
      });
    }
  };

  const deleteTrigger = (actionID: string, triggerID: string) => {
    if (data) {
      setData({
        ...data,
        actions: data.actions.map((action) => {
          if (action.id === actionID) {
            return {
              ...action,
              triggers: action.triggers.filter(
                (trig) => trig.id !== triggerID
              ),
            };
          }
          return action;
        }),
      });
    }
  };

  const deleteResult = (actionID: string, resultID: string) => {
    if (data) {
      setData({
        ...data,
        actions: data.actions.map((act) => {
          if (act.id === actionID) {
            return {
              ...act,
              results: [],
            };
          }
          return act;
        }),
      });
    }
  };

  const setModalSave = () => {
    setShowModalSaveWindow(true);
  };

  const cancelModalSave = () => {
    setShowModalSaveWindow(false);
  };

  const saveFromModal = async (filename: string, tag: string) => {
    // data?.setup.activitySettings.resources.map((res) => console.log(res));
    if (data) {
      const offlineData = {
        ...data,
        resources: {
          ...data?.resources,
          imagesContents: await convertResourcesToBase64(
            data.resources.imagesContents
          ),
        },
      };
      const str = JSON.stringify(offlineData);
      saveFromModalSrvr(filename, tag, str);
      cancelModalSave();
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        actionsPaneActive,
        actionsPaneSelect,
        stagesPaneActive,
        stagesPaneSelect,
        setData,
        setInitialData,
        currentStageID,
        setBlankData,
        selectedImage,
        selectImage,
        updateImageData,
        sendToBack,
        bringToFront,
        addImageToData,
        deleteImageFromData,
        lockImage,
        setVisible,
        addAudioToData,
        setConnection,
        setDraggers,
        settingConnectionActive,
        settingDraggersActive,
        settingDropPositionActive,
        setDropPosition,
        setDropPositionData,
        connectionNode,
        offlineSave,
        setZPosType,
        optionsSelected,
        selectOptions,
        resetSelections,
        makeOptionChange,
        settingCorrect,
        settingIncorrect,
        setMultiChoiceOption,
        addNewStage,
        goToPreviousStage,
        goToNextStage,
        setStage,
        reOrderStages,
        viewScale,
        setViewScale,
        updateThumb,
        getActivityResource,
        getContentResource,
        saveAction,
        addTrigger,
        addResult,
        deleteTrigger,
        deleteResult,
        setModalSave,
        showModalSaveWindow,
        saveFromModal,
        cancelModalSave,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
