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
  REGISTRATION_DIALOG_CLOSE
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      // console.log("inside reducer");
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };

    case REGISTER_SUCCESS:
      // localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: false,
        loading: false,
        registrationCompleteDialog: true
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
        // registrationCompleteDialog: true
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        // isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        // isAuthenticated: false,
        error: null,
        loading: false
      };
    case REGISTRATION_DIALOG_OPEN:
      return {
        ...state,
        // isAuthenticated: false,
        registrationCompleteDialog: true
      };
    case REGISTRATION_DIALOG_CLOSE:
      return {
        ...state,
        // isAuthenticated: false,
        registrationCompleteDialog: false
      };
    // case TOGGLE_LOADING:
    //   let toggle = "";
    //   if (state.loading === true) {
    //     toggle = false;
    //   } else {
    //     toggle = true;
    //   }
    //   return {
    //     ...state,
    //     loading: toggle
    //   };
    default:
      return state;
  }
};
