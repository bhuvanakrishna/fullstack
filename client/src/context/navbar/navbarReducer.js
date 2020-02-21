import {
  REQUESTS_PAGE,
  SEARCH_USERS_PAGE,
  DISCUSSION_PAGE,
  PROFILE_PAGE
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case REQUESTS_PAGE:
      // console.log("inside reducer");
      return {
        searchUsersPage: false,
        requestsPage: true,
        discussionPage: false,
        profilePage: false
      };

    case SEARCH_USERS_PAGE:
      return {
        searchUsersPage: true,
        requestsPage: false,
        discussionPage: false,
        profilePage: false
      };

    case DISCUSSION_PAGE:
      return {
        searchUsersPage: false,
        requestsPage: false,
        discussionPage: true,
        profilePage: false
      };

    case PROFILE_PAGE:
      return {
        searchUsersPage: false,
        requestsPage: false,
        discussionPage: false,
        profilePage: true
      };
    default:
      return state;
  }
};
