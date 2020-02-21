import React, { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../layout/Navbar";
import styles from "./Searchusers.module.css";
import Footer from "../layout/Footer";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import OnlineUsersList from "../layout/OnlineUsersList";
import IndividualUser from "../layout/IndividualUser";
import individualRequest from "../layout/IndividualRequest";
import AuthContext from "../../context/auth/authContext";
import NavbarContext from "../../context/navbar/navbarContext";
import socketIOClient from "socket.io-client";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import axios from "axios";
import IndividualRequest from "../layout/IndividualRequest";
import HashLoader from "react-spinners/BarLoader";
import PaintCanvas from "../layout/PaintCanvas";

var socket;
let requestsToCurrentUser;

const useStyles = makeStyles({
  cssLabel: {
    color: "black"
  },
  cssLabelFocused: {
    color: "black !important"
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#fcba04 !important`
    }
  },

  cssFocused: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#fcba04 !important`
    }
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "black !important"
  }
});

const Searchusers = props => {
  const authContext = useContext(AuthContext);
  const navbarContext = useContext(NavbarContext);

  const [search, searchState] = useState({
    onlineUsers: null,
    searchTerm: "",
    selectedUser: null
  });

  const [loadUserFlag, setLoadUser] = useState(false);

  const [selectedUserState, changeSelectedUserState] = useState("");

  const [requestsState, changeRequestsState] = useState(0);

  const [allRequestsState, changeAllRequestsState] = useState("");

  const [selectedRequest, changeSelectedRequest] = useState("");

  const [loading, changeLoading] = useState(true);

  let changeRequestsToZero = () => {
    changeRequestsState(requestsState => 0);
  };

  let handleChangeSeletedUser = user => {
    // console.log("user");
    // console.log(user);
    changeSelectedUserState(user);
  };

  let handleIndividualRequest = reqObj => {
    console.log("inside handle individual request");
    changeSelectedRequest(reqObj);
  };
  // useEffect(() => {
  //   console.log("state changed:");
  //   console.log(selectedUserState);
  // }, [selectedUserState]);

  // console.log("online users:");
  // console.log(search.onlineUsers);

  const { isAuthenticated, user } = authContext;
  // authContext.loadUser();

  useEffect(() => {
    // changeLoading(true);
    let loadUserFunction = async () => {
      await authContext.loadUser();
      // console.log("is authenticated: " + isAuthenticated);
      // console.log(authContext.user);
      setLoadUser(true);
    };

    if (!loadUserFlag) {
      loadUserFunction();
      // changeLoading(false);
    }
  }, []);

  useEffect(() => {
    // if (authContext.user && isAuthenticated && !authContext.loading) {
    if (loadUserFlag) {
      // changeLoading(true);
      //gettting requests of the current user from db

      socket = socketIOClient("http://localhost:5000");
      socket.on("connect", () => {
        console.log("Connected!!");
        socket.emit("userconnected", authContext.user);
        socket.emit("join", { name: authContext.user.name });

        socket.on("requestFrom", async function(data) {
          console.log("received msg from :");
          console.log(data.from);
          console.log("message is:");
          console.log(data.msg);
          changeRequestsState(requestsState => requestsState + 1);
          let userObject = {
            from: data.from,
            to: authContext.user.name,
            reqMsg: data.msg
          };
          await axios.put("/requests", userObject);
        });

        socket.on("listofonline", list => {
          // console.log("list of online users: ");

          searchState({
            ...search,
            onlineUsers: list
          });

          // console.log(this.state.onlineUsers);
        });
      });
      // changeLoading(false);
      // setSocketState((socketState.socket = socket));
    }
  }, [loadUserFlag]);

  useEffect(() => {
    const getRequests = () => {
      try {
        console.log("inside getRequests function");
        axios
          .get("/requests", {
            params: { name: authContext.user.name }
          })
          .then(response => {
            console.log(response);
            requestsToCurrentUser = response;
            console.log("REquests to current User:");
            console.log(requestsToCurrentUser.data[0].receivedRequests.length);
            changeAllRequestsState({
              ...allRequestsState,
              requestsToCurrentUser
            });
          });
      } catch (error) {
        console.log(error);
      }
    };
    if (authContext.user) {
      // changeLoading(true);
      getRequests();
      // changeLoading(false);
    }
  }, [authContext.user, requestsState]);

  useEffect(() => {
    if (allRequestsState != "" && search.onlineUsers != null) {
      changeLoading(false);
    } else {
      changeLoading(true);
    }
  }, [allRequestsState, search.onlineUsers]);

  const onChangeSearch = e => {
    searchState({
      ...search,
      searchTerm: e.target.value
    });
    // this.setState({ searchTerm: e.target.value });
    console.log("inside on change search");
  };

  const classes = useStyles();

  let filteredUsers;
  if (search.onlineUsers) {
    filteredUsers = search.onlineUsers.filter(user => {
      return (
        // user.name
        //   .toLowerCase()
        //   .indexOf(this.state.searchTerm.toLowerCase()) !== -1
        user.name.toLowerCase().includes(search.searchTerm.toLowerCase())
      );
    });
  }

  //code related to paint app

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <HashLoader
          color={"#fcba04"}
          loading={loading}
          size={100}
          width={250}
          height={2}
        />
      </div>
    );
  } else {
    if (navbarContext.searchUsersPage) {
      return (
        <div>
          <Navbar
            requests={requestsState}
            onClick={() => {
              changeRequestsToZero();
            }}
          ></Navbar>

          <div className={styles.container}>
            <div className={styles.searchUsers}>
              <div className={styles.searchusersinternal}>
                <form>
                  <TextField
                    id="outlined-basic"
                    label="Search Online Users"
                    variant="outlined"
                    // InputProps={{ classes: props.classes }}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssLabelFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline
                      }
                      // className: classes.notchedOutline
                    }}
                    fullWidth
                    onChange={onChangeSearch}
                  />
                </form>
                {search.onlineUsers ? (
                  <OnlineUsersList
                    // list={this.state.onlineUsers}
                    list={filteredUsers}
                    changeSelectedUser={handleChangeSeletedUser}
                  ></OnlineUsersList>
                ) : (
                  <p>
                    <span>&nbsp;&nbsp;&nbsp;</span>No online users!!
                  </p>
                )}
              </div>
            </div>
            <div className={styles.showUsers}>
              <div className={styles.showusersinternal}>
                {socket != undefined ? (
                  <IndividualUser
                    list={filteredUsers}
                    individualUser={selectedUserState}
                    socket={socket}
                  ></IndividualUser>
                ) : (
                  <IndividualUser
                    list={filteredUsers}
                    individualUser={selectedUserState}
                  ></IndividualUser>
                )}
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      );
    } else if (navbarContext.requestsPage) {
      return (
        <div>
          <Navbar></Navbar>

          <div className={styles.requestsContainer}>
            <div className={styles.allRequests}>
              <div className={styles.allRequestsInternal}>
                <div className={styles.allRequestsInternalInternal}>
                  <Paper style={{ maxHeight: "100%", overflow: "auto" }}>
                    <List>
                      {requestsToCurrentUser.data[0].receivedRequests.map(
                        (msgObject, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() => {
                              handleIndividualRequest(msgObject);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt="PP"
                                src="https://api.adorable.io/avatars/285/abott@adorable.png"
                              />
                            </ListItemAvatar>
                            {/* <ListItemIcon>{img}</ListItemIcon> */}
                            <span>&nbsp;&nbsp;</span>
                            <ListItemText primary={msgObject.from} />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Paper>
                </div>
              </div>
            </div>
            <div className={styles.individualRequest}>
              <div className={styles.individualRequestInternal}>
                <IndividualRequest
                  selectedRequest={selectedRequest}
                ></IndividualRequest>
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      );
    } else if (navbarContext.profilePage) {
      return <Navbar></Navbar>;
    } else if (navbarContext.discussionPage) {
      return (
        <div>
          <h1>this is discussion page</h1>
          <div className={styles.paintCanvas}>
            <PaintCanvas socket={socket}></PaintCanvas>
          </div>
        </div>
      );
    }
  }
};

export default Searchusers;
