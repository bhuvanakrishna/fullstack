import React, { useReducer } from "react";

import AuthContext from "./authContext";

import authReducer from "./authReducer";

import axios from "axios";

import setAuthToken from "../../utils/setAuthToken";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  REGISTRATION_DIALOG_OPEN,
  REGISTRATION_DIALOG_CLOSE,
  TOGGLE_LOADING
} from "../types";

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
    registrationCompleteDialog: false
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //ACTIONS

  //load user - check which user is logged in
  const loadUser = async () => {
    //we need this action because jwt is stateless. so, we need to check everytime whether the user is logged in by hitting the route auth.js
    //also here we are putting token in global headers
    //we also do this in our app.js so we get to know if the user is authenticated or not
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // console.log("inside load user");
    try {
      const res = await axios.get("/auth");
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (error) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  //register user
  const registerAction = async formData => {
    const config = {
      headers: {
        "Content-Type": "Application/JSON"
      }
    };
    // console.log("inside auth state");
    try {
      const res = await axios.post("/register", formData, config);
      dispatch({
        type: REGISTER_SUCCESS,
        //res.data contains the token given by the api
        payload: res.data
      });
      // console.log("user registered..");

      // loadUser();
    } catch (error) {
      //called when the api responds with error
      dispatch({
        type: REGISTER_FAIL,
        //since we are passing a json which has an error 'msg'. There are two error msgs in auth route for register. one is for email taken and other is for name taken
        payload: error.response.data.msg
      });
    }
  };

  //login user
  const login = async formData => {
    const config = {
      headers: {
        "Content-Type": "Application/JSON"
      }
    };
    // console.log("inside login");
    try {
      const res = await axios.post("/auth", formData, config);
      dispatch({
        type: LOGIN_SUCCESS,
        //res.data contains the token given by the api
        payload: res.data
      });

      loadUser();
      return res;
    } catch (error) {
      //called when the api responds with error
      dispatch({
        type: LOGIN_FAIL,
        //since we are passing a json which has an error 'msg'. There are two error msgs in auth route for register. one is for email taken and other is for name taken
        payload: error.response.data.msg
      });
    }
  };

  //logout
  const logout = () => dispatch({ type: LOGOUT });

  //clear errors - clear any errors in state
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  //OPEN registration complete dialog
  const openDialog = () => {
    dispatch({ type: REGISTRATION_DIALOG_OPEN });
  };

  //CLOSE registration complete dialog
  const closeDialog = () => {
    dispatch({ type: REGISTRATION_DIALOG_CLOSE });
  };

  //toggle loading
  const toggleLoading = () => {
    dispatch({ type: TOGGLE_LOADING });
  };

  return (
    <AuthContext.Provider
      value={{
        //all state items and actions go here so that all components can access them
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        registerAction,
        clearErrors,
        registrationCompleteDialog: state.registrationCompleteDialog,
        openDialog,
        closeDialog,
        toggleLoading,
        loadUser,
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
