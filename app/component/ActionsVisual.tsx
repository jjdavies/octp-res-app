'use client';
import React, { useContext, useState } from 'react';
import DataContext from './DataContext';
import builderStyles from '../styles/Builder.module.css';
import Action from '../interfaces/actionSystem/Action';
import Trigger from '../interfaces/actionSystem/Trigger';
import Result from '../interfaces/actionSystem/Result';

interface ActionsVisualProps {
  partialAction: Action;
  selectedActionID: string;
  selectAction: Function;
  deleteTrigger: Function;
  deleteResult: Function;
}

export default function ActionsVisual(props: ActionsVisualProps) {
  const { data, deleteTrigger, deleteResult } =
    useContext(DataContext);
  console.log(props.partialAction);
  const dataActions = data?.actions;
  const combinedActions = dataActions
    ? [...dataActions, props.partialAction]
    : [props.partialAction];

  console.log(combinedActions);

  const [moduleInFocus, setModuleInFocus] = useState<string>('');

  const triggerClick = (id: string) => {
    setModuleInFocus(id);
  };

  const containerClick = (e: any) => {
    if (e.target.id === 'actionsVisualContainer') {
      setModuleInFocus('');
    }
  };

  const deleteTriggerHandler = (actID: string, triggerID: string) => {
    if (props.partialAction.id === props.selectedActionID) {
      //action is temporary action (not in data)
      props.deleteTrigger(actID, triggerID);
    }
    deleteTrigger(actID, triggerID);
  };

  const deleteResultHandler = (actID: string, resultID: string) => {
    if (props.partialAction.id === props.selectedActionID) {
      //action is temporary action (not in data)
      props.deleteResult(actID, resultID);
    }
    deleteResult(actID, resultID);
  };

  return (
    <div
      id="actionsVisualContainer"
      className={builderStyles.actionsVisual}
      onClick={containerClick}
    >
      {combinedActions.map((act, actionIndex) => (
        <div
          key={act.id}
          className={builderStyles.actionVisualContainer}
          style={{
            border:
              act.id === props.selectedActionID
                ? '4px solid gold'
                : 0,
            zIndex:
              act.id === props.selectedActionID ? 999 : 'initial',
          }}
          onClick={() => props.selectAction(act.id)}
        >
          {/* triggers group */}
          <div className={builderStyles.actionVisualGroup}>
            {act.triggers &&
              act.triggers.length > 0 &&
              act.triggers.map((trig: Trigger, index: number) => (
                <div
                  key={trig.id}
                  className={builderStyles.actionVisualModule}
                  style={{ border: 'dark green' }}
                  onClick={() => triggerClick(trig.id)}
                >
                  <div
                    className={builderStyles.actionVisualModuleBox}
                    style={{ border: '2px solid darkgreen' }}
                  >
                    <div
                      className={
                        builderStyles.actionVisualModuleLabel
                      }
                    >
                      Trigger {index + 1}[{trig.type}]
                    </div>
                    {
                      trig.type === 'ResourceTrigger' && <></>
                      // trig.trigger.resourceID &&
                      // trig.trigger.resourceID.substring(0, 10) +
                      //   ' ... ' +
                      //   trig.trigger.event
                    }
                  </div>

                  <div className={builderStyles.vConnect}></div>
                  {moduleInFocus === trig.id && (
                    <div
                      className={
                        builderStyles.actionVisualContextMenu
                      }
                    >
                      <div
                        className={
                          builderStyles.actionVisualContextMenuItem
                        }
                        onClick={() =>
                          deleteTriggerHandler(act.id, trig.id)
                        }
                      >
                        delete
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className={builderStyles.actionVisualGroup}>
            {act.triggers.length > 1 && (
              <div
                className={builderStyles.hConnect}
                style={{
                  // width: +((100 / (act.triggers.length + 1)) * 2) + '%',
                  width:
                    (101 / act.triggers.length) *
                      (act.triggers.length - 1) +
                    '%',
                }}
              ></div>
            )}
          </div>
          <div className={builderStyles.actionVisualGroup}>
            <div
              className={builderStyles.actionVisualModule}
              style={{ borderRadius: 0 }}
            >
              <div className={builderStyles.vConnect}></div>
              <div
                className={builderStyles.actionVisualModuleBox}
                style={{
                  border: '2px solid darkred',
                  fontSize: '20px',
                }}
              >
                Action {act.id.substring(0, 10) + '...'}
              </div>
              <div className={builderStyles.vConnect}></div>
            </div>
          </div>
          <div className={builderStyles.actionVisualGroup}>
            {act.results.length > 1 && (
              <div
                className={builderStyles.hConnect}
                style={{
                  width:
                    (101 / act.results.length) *
                      (act.results.length - 1) +
                    '%',
                }}
              ></div>
            )}
          </div>
          <div className={builderStyles.actionVisualGroup}>
            {act.results.map((result: Result, index: number) => (
              <div
                key={result.id}
                className={builderStyles.actionVisualModule}
                onClick={() => setModuleInFocus(result.id)}
              >
                <div className={builderStyles.vConnect}></div>
                <div
                  className={builderStyles.actionVisualModuleBox}
                  style={{ border: '2px solid darkblue' }}
                >
                  {moduleInFocus === result.id && (
                    <div
                      className={
                        builderStyles.actionVisualContextMenu
                      }
                    >
                      <div
                        className={
                          builderStyles.actionVisualContextMenuItem
                        }
                        onClick={() =>
                          deleteResultHandler(act.id, result.id)
                        }
                      >
                        delete
                      </div>
                    </div>
                  )}
                  <div
                    className={builderStyles.actionVisualModuleLabel}
                  >
                    [{result.type}]
                  </div>
                  {
                    result.type === 'Resource Animation Result' && (
                      <></>
                    )
                    // result.result.resourceID.substring(0, 10) +
                    //   ' ... ' +
                    //   result.result.property +
                    //   ' --> ' +
                    //   result.result.value.value
                  }
                </div>
              </div>
            ))}
            {/* {act.results && act.results.length > 0 && (
              <div
                className={builderStyles.actionVisualModule}
                onClick={() => setModuleInFocus(act.results[0].id)}
              >
                <div
                  className={builderStyles.actionVisualModuleBox}
                  style={{ border: '2px solid darkblue' }}
                >
                  {moduleInFocus === act.results[0].id && (
                    <div className={builderStyles.actionVisualContextMenu}>
                      <div
                        className={builderStyles.actionVisualContextMenuItem}
                        onClick={() =>
                          deleteResultHandler(act.id, act.results[0].id)
                        }
                      >
                        delete
                      </div>
                    </div>
                  )}
                  <div className={builderStyles.actionVisualModuleLabel}>
                    [{act.results[0].type}]
                  </div>
                  {act.results[0].type === 'Resource Animation Result' &&
                    act.results[0].result.resourceID.substring(0, 10) +
                      ' ... ' +
                      act.results[0].result.property +
                      ' --> ' +
                      act.results[0].result.value.value}
                </div>
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
}
