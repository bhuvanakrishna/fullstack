import React, { useReducer } from "react";

import NavbarContext from "./navbarContext";

import navbarReducer from "./navbarReducer";

// import axios from "axios";`1

// import setAuthToken from "../../utils/setAuthToken";

import {
  REQUESTS_PAGE,
  SEARCH_USERS_PAGE,
  DISCUSSION_PAGE,
  PROFILE_PAGE
} from "../types";

const NavbarState = props => {
  const initialState = {
    searchUsersPage: true,
    requestsPage: false,
    discussionPage: false,
    profilePage: false
  };

  const [state, dispatch] = useReducer(navbarReducer, initialState);

  //ACTIONS

  //change pages
  const toSearchUsersPage = () => {
    dispatch({
      type: SEARCH_USERS_PAGE
    });
  };

  const toRequestsPage = () => {
    dispatch({
      type: REQUESTS_PAGE
    });
  };

  const toDiscussionPage = () => {
    dispatch({
      type: DISCUSSION_PAGE
    });
  };

  const toProfilePage = () => {
    dispatch({
      type: PROFILE_PAGE
    });
  };

  return (
    <NavbarContext.Provider
      value={{
        //all state items and actions go here so that all components can access them
        searchUsersPage: state.searchUsersPage,
        requestsPage: state.requestsPage,
        discussionPage: state.discussionPage,
        profilePage: state.profilePage,
        toSearchUsersPage,
        toRequestsPage,
        toProfilePage,
        toDiscussionPage
      }}
    >
      {props.children}
    </NavbarContext.Provider>
  );
};

export default NavbarState;
