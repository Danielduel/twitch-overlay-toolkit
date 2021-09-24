import React from "react";

export type NumberReducerActionType =
  | "add"
  | "subtract"
  | "set";
export type NumberReducerAction = {
  action: NumberReducerActionType;
  value: number;
}

function numberReducer(state: number, action: NumberReducerAction) {
  switch(action.action) {
    case "add":
      return state + action.value;
    case "subtract":
      return state - action.value;
    case "set":
      return action.value;
    default:
      return state;
  }
}

export function useNumberReducer(initialState: number) {
  const [state, dispatch] = React.useReducer(numberReducer, initialState);
  const add = React.useCallback((value: number) => dispatch({
    action: "add",
    value
  }), [ dispatch ]);
  const subtract = React.useCallback((value: number) => dispatch({
    action: "subtract",
    value
  }), [ dispatch ]);
  const set = React.useCallback((value: number) => dispatch({
    action: "set",
    value
  }), [ dispatch ]);

  return {
    state,
    add,
    subtract,
    set
  } as const;
}
