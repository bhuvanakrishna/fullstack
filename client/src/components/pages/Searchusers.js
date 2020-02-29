import React, { useContext, useEffect, useState, useRef } from "react";
import Navbar from "../layout/Navbar";
import styles from "./Searchusers.module.css";
import Footer from "../layout/Footer";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import OnlineUsersList from "../layout/OnlineUsersList";
import IndividualUser from "../layout/IndividualUser";
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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import VideoChat from "../layout/VideoChat";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

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
  },
  yellowColor: {
    color: "black"
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

  const [connectedTo, changeConnectedToState] = useState("");

  const changeConnectedToFunction = user => {
    changeConnectedToState(user);
  };

  const [connectDialogue, changeConnectDialogueState] = useState({
    open: false,
    user: "",
    res: false
  });

  const [reqForDiscussion, changeReqForDiscussion] = useState({
    from: "",
    to: ""
  });

  const [requestsSentTo, changeRequestsSentTo] = useState([]);

  //this function is sent as prop to individual user component which triggers this fn. on sending request to a user

  const handleRequestsList = (from, to) => {
    changeRequestsSentTo(oldArray => [
      ...oldArray,
      {
        from: from,
        to: to
      }
    ]);
  };

  let requestsNumber = 0;

  const handleConnectCancel = () => {
    changeConnectDialogueState({
      ...connectDialogue,
      res: false,
      open: false
    });

    socket.emit("resAvailability", {
      isAvailable: false,
      to: reqForDiscussion.from,
      from: reqForDiscussion.to
    });
  };

  const handleConnectOk = () => {
    changeConnectDialogueState({
      ...connectDialogue,

      open: false
    });

    let response = false;

    if (!navbarContext.discussionPage) {
      response = true;
    }

    socket.emit("resAvailability", {
      isAvailable: response,
      to: reqForDiscussion.from,
      from: reqForDiscussion.to
    });
  };

  useEffect(() => {
    if (navbarContext.discussionPage) {
      let present = false;
      socket.on("listofonline", list => {
        list.forEach(user => {
          if (user.name == connectedTo) {
            present = true;
          }
        });

        if (!present) {
          navbarContext.toSearchUsersPage();

          alert("User Disconnected!!");
          window.location.reload();
        }
      });
    }
  }, [navbarContext.discussionPage]);

  // code related to video chat ******************************************************************

  const [isInitiator, changeIsInitiator] = useState(false);

  const handleInitiator = () => {
    // console.log(
    //   "inside handle initiator. Triggered by indiv. req. accept button. this variable is passed to video chat app to initiate chat"
    // );
    changeIsInitiator(true);
  };

  //********************************************************************************************8 */

  let changeRequestsToZero = async () => {
    changeRequestsState(0);
  };

  let handleChangeSeletedUser = user => {
    changeSelectedUserState(user);
  };

  let handleIndividualRequest = reqObj => {
    changeSelectedRequest(reqObj);
  };

  let removeSelectedRequest = () => {
    changeSelectedRequest("");
  };

  const [deleteAccountDialogState, changeDeleteAccountDialogState] = useState(
    false
  );

  const [showBio, changeShowBio] = useState(false);

  const handleDeleteAccount = () => {
    changeDeleteAccountDialogState(true);
  };

  const handleUpdateBio = () => {
    changeShowBio(true);
  };

  const handleCancelDeleteAccount = () => {
    changeDeleteAccountDialogState(false);
  };

  const [deleteButtonLoading, changeDeleteButtonLoading] = useState(false);

  useEffect(() => {
    if (deleteButtonLoading) {
      const deleteAccountAsync = async () => {
        await axios
          .delete("/deleteaccount", {
            data: {
              name: authContext.user.name
            }
          })
          .then(response => {
            // console.log(response);

            authContext.logout();
            changeDeleteButtonLoading(false);
            window.location.href = "/";
          });
      };

      deleteAccountAsync();
    }
  }, [deleteButtonLoading]);

  const handleOkDeleteAccount = async () => {
    changeDeleteButtonLoading(true);
  };

  const [bioHelperText, changeBioHelperText] = useState("Max. 100 characters");
  const [bioError, changeBioError] = useState(false);
  const [bioField, changeBioField] = useState("");

  const handleSubmitBio = async e => {
    e.preventDefault();
    changeBioField(authContext.user.bio);

    if (bioField == "") {
      changeBioHelperText("Please update your bio!!");
      changeBioError(true);
      return;
    }

    let obj = {
      name: authContext.user.name,
      bio: bioField
    };

    changeBioHelperText("Updating...");

    let response = await axios.put("/updatebio", obj);

    if (response.data == "Success") {
      changeBioHelperText("Updated Successfully!");
    } else {
      changeBioHelperText("Error updating bio. Please try later.");
      window.location.reload();
      return;
    }

    changeShowBio(false);
  };

  const handleBioField = e => {
    changeBioError(false);

    changeBioHelperText("Max. 100 characters");
    changeBioField(e.target.value);
  };

  useEffect(() => {
    let loadUserFunction = async () => {
      await authContext.loadUser();

      setLoadUser(true);
    };

    if (!loadUserFlag) {
      loadUserFunction();
    }
  }, []);

  useEffect(() => {
    if (loadUserFlag) {
      socket = socketIOClient("http://localhost:5000");
      socket.on("connect", () => {
        // console.log("Connected!!");
        socket.emit("userconnected", authContext.user);
        socket.emit("join", { name: authContext.user.name });

        socket.on("requestFrom", async function(data) {
          if (!navbarContext.requestsPage) {
            changeRequestsState(requestsState => requestsState + 1);
          }

          let userObject = {
            from: data.from,
            to: authContext.user.name,
            reqMsg: data.msg
          };

          await axios.put("/requests", userObject);
        });

        socket.on("listofonline", list => {
          list = list.filter(user => {
            return user.name != authContext.user.name;
          });

          searchState({
            ...search,
            onlineUsers: list
          });
        });
      });

      socket.on("isAvailableForDiscussion", data => {
        changeReqForDiscussion({
          from: data.from,
          to: data.to
        });

        changeConnectDialogueState({
          ...connectDialogue,
          open: true,
          user: data.from
        });
      });

      socket.on("changeToDiscussionPage", data => {
        changeConnectedToState(data.otherUser);
        navbarContext.toDiscussionPage();
      });
    }
  }, [loadUserFlag]);

  const updateList = id => {
    let newList = allRequestsState.filter(obj => obj.id != id);

    changeAllRequestsState(newList);
  };

  useEffect(() => {
    const getRequests = () => {
      try {
        axios
          .get("/requests", {
            params: { name: authContext.user.name }
          })
          .then(response => {
            requestsToCurrentUser = response.data[0].receivedRequests;

            changeAllRequestsState(requestsToCurrentUser);
          });
      } catch (error) {
        console.log(error);
      }
    };
    if (authContext.user) {
      getRequests();
    }
  }, [authContext.user, requestsState]);

  useEffect(() => {
    if (allRequestsState && search.onlineUsers != null) {
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
  };

  const classes = useStyles();

  let filteredUsers;
  if (search.onlineUsers && search) {
    filteredUsers = search.onlineUsers.filter(user => {
      return user.name.toLowerCase().includes(search.searchTerm.toLowerCase());
    });
  }

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
          {/* confirmation dialogue for getting connected */}
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={connectDialogue.open}
          >
            <DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>
            <DialogContent>
              <p>
                <strong>{connectDialogue.user}</strong> accepted your request.
                Click OK to connect now.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConnectCancel} color="primary">
                Cancel
              </Button>
              <Button autoFocus onClick={handleConnectOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
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
                    }}
                    fullWidth
                    onChange={onChangeSearch}
                  />
                </form>
                {search.onlineUsers.length ? (
                  <OnlineUsersList
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
                    handleRequestsList={handleRequestsList}
                    requestsSentTo={requestsSentTo}
                  ></IndividualUser>
                ) : (
                  <IndividualUser
                    list={filteredUsers}
                    individualUser={selectedUserState}
                    handleRequestsList={handleRequestsList}
                    requestsSentTo={requestsSentTo}
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
          {/* confirmation dialogue for getting connected */}
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={connectDialogue.open}
          >
            <DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>
            <DialogContent>
              <p>
                <strong>{connectDialogue.user}</strong> accepted your request.
                Click OK to connect now.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConnectCancel} color="primary">
                Cancel
              </Button>
              <Button autoFocus onClick={handleConnectOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>

          <Navbar></Navbar>

          <div className={styles.requestsContainer}>
            <div className={styles.allRequests}>
              <div className={styles.allRequestsInternal}>
                <div className={styles.allRequestsInternalInternal}>
                  <Paper style={{ maxHeight: "100%", overflow: "auto" }}>
                    <List>
                      {allRequestsState.map((msgObject, index) => (
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

                          <span>&nbsp;&nbsp;</span>
                          <ListItemText primary={msgObject.from} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </div>
              </div>
            </div>
            <div className={styles.individualRequest}>
              <div className={styles.individualRequestInternal}>
                <IndividualRequest
                  selectedRequest={selectedRequest}
                  onlineUsersList={search.onlineUsers}
                  socket={socket}
                  setUser={changeConnectedToFunction}
                  handleInitiator={handleInitiator}
                  updateList={updateList}
                  removeSelectedRequest={removeSelectedRequest}
                  allRequestsState={allRequestsState}
                ></IndividualRequest>
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      );
    } else if (navbarContext.profilePage) {
      return (
        <div>
          {/* confirmation dialogue for getting connected */}
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={connectDialogue.open}
          >
            <DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>
            <DialogContent>
              <p>
                <strong>{connectDialogue.user}</strong> accepted your request.
                Click OK to connect now.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConnectCancel} color="primary">
                Cancel
              </Button>
              <Button autoFocus onClick={handleConnectOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>

          <Navbar></Navbar>
          <div className={styles.profilePageContainer}>
            <div className={styles.profileSettings}>
              <div className={styles.buttonsDiv}>
                <div className={styles.changeBioButton}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#fcba04", color: "white" }}
                    onClick={handleUpdateBio}
                    disabled={showBio}
                  >
                    Update Bio
                  </Button>
                </div>
                <br />
                {showBio ? (
                  <div className={styles.showBioContainer}>
                    <form>
                      <div className={styles.bioTextField}>
                        <TextField
                          required
                          fullWidth
                          id="filled-basic"
                          label="Bio"
                          variant="outlined"
                          defaultValue={authContext.user.bio}
                          InputProps={{
                            classes: {
                              root: classes.cssOutlinedInput,
                              focused: classes.cssFocused,
                              notchedOutline: classes.notchedOutline
                            }
                          }}
                          InputLabelProps={{
                            classes: {
                              root: classes.cssLabel,
                              focused: classes.cssLabelFocused
                            }
                          }}
                          inputProps={{ maxLength: 100 }}
                          onChange={handleBioField}
                          error={bioError}
                          helperText={bioHelperText}
                        />
                      </div>

                      <div className={styles.updateBioButton}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "green", color: "white" }}
                          onClick={handleSubmitBio}
                          type="submit"
                        >
                          Update
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}

                <div className={styles.changeBioButton}>
                  <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    open={deleteAccountDialogState}
                  >
                    <DialogTitle id="confirmation-dialog-title">
                      Are you sure?
                    </DialogTitle>
                    <DialogContent dividers>
                      <h4>Your account will be deleted permanently.</h4>
                    </DialogContent>
                    <DialogActions>
                      {deleteButtonLoading ? (
                        <React.Fragment>
                          <CircularProgress
                            size={16}
                            classes={{ colorPrimary: classes.yellowColor }}
                          />
                          <span>&nbsp;&nbsp;</span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Button
                            autoFocus
                            onClick={handleCancelDeleteAccount}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleOkDeleteAccount}
                            color="primary"
                          >
                            Ok
                          </Button>
                        </React.Fragment>
                      )}
                    </DialogActions>
                  </Dialog>

                  <Button
                    variant="contained"
                    style={{ backgroundColor: "red", color: "white" }}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      );
    } else if (navbarContext.discussionPage) {
      return (
        <div>
          <div className={styles.discussionPageContainer}>
            <div className={styles.navbar}>
              <div className={styles.navbarName}>
                <Typography
                  variant="h5"
                  style={{ flexGrow: "1", color: "white" }}
                >
                  E-VID BOARD
                </Typography>
              </div>
            </div>
            <div className={styles.videoChat}>
              <VideoChat
                socket={socket}
                isInitiator={isInitiator}
                connectedTo={connectedTo}
              ></VideoChat>
            </div>

            <div className={styles.paintComponent}>
              <PaintCanvas
                socket={socket}
                connectedTo={connectedTo}
              ></PaintCanvas>
            </div>

            <Footer></Footer>
          </div>
        </div>
      );
    }
  }
};

export default Searchusers;
