import React, { useReducer } from "react";

import AlertContext from "./alertContext";

import alertReducer from "./alertReducer";

import { SET_ALERT, REMOVE_ALERT } from "../types";

const AuthState = props => {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  //actions

  //set alert

  return (
    <AuthContext.Provider
      value={{
        //all state items and actions go here so that all components can access them
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
