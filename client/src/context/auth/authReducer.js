import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  CLEAR_ERRORS,
  REGISTRATION_DIALOG_OPEN,
  REGISTRATION_DIALOG_CLOSE,
  TOGGLE_LOADING
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        registrationCompleteDialog: true
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        loading: false
      };
    case REGISTRATION_DIALOG_OPEN:
      return {
        ...state,
        registrationCompleteDialog: true
      };
    case REGISTRATION_DIALOG_CLOSE:
      return {
        ...state,
        registrationCompleteDialog: false
      };
    case TOGGLE_LOADING:
      let toggle = "";
      if (state.loading === true) {
        toggle = false;
      } else {
        toggle = true;
      }
      return {
        ...state,
        loading: toggle
      };
    default:
      return state;
  }
};
