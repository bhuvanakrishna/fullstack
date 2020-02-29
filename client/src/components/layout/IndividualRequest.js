import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AuthContext from "../../context/auth/authContext";
import NavbarContext from "../../context/navbar/navbarContext";
import styles from "../pages/Searchusers.module.css";
import HashLoader from "react-spinners/ScaleLoader";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "axios";

const imgStyle = {
  height: "200px",
  width: "200px",
  display: "inline-block"
};

const name = {
  fontSize: "32px"
};

const bio = {
  fontSize: "14px"
};

const namebiocontainer = {
  display: "flex",
  flexDirection: "column",
  paddingBottom: "2%"
};

const sendreq = {
  textDecoration: "underline",
  marginBottom: "1%"
};

const acceptButton = {
  // background: "#fcba04",
  background: "green",
  width: "150px",
  marginTop: "10px",
  marginBottom: "10px",
  marginRight: "10px"
};

const deleteButton = {
  background: "red",
  width: "150px",
  marginTop: "10px",
  marginBottom: "10px",
  marginRight: "10px"
};

const yellowColor = {
  color: "#fcba04"
};

const useStyles = makeStyles(theme => ({
  underlineyellow: {
    "&:before": {
      borderBottomColor: "black"
    },
    "&:after": {
      borderBottomColor: "#fcba04"
    },
    "&:hover:before": {
      //   borderBottomColor: ["white", "!important"]
    }
  },
  blacklabel: {
    color: ["black", "!important"]
  }
}));

let userDataFromDB;

function IndividualRequest(props) {
  //using context to change view to discussion page upon user accepting discussion
  const navbarContext = useContext(NavbarContext);
  const authContext = useContext(AuthContext);

  const [loading, changeLoading] = useState(true);

  const [acceptDiscussionLoading, changeAcceptDiscussionLoading] = useState({
    state: false
  });

  const [deletedRequest, changeDeletedRequest] = useState(false);

  let buttonFlag = false;

  const changeButtonVariable = () => {
    if (buttonFlag) {
      changeAcceptDiscussionLoading({
        state: false
      });
      buttonFlag = false;
    } else {
      changeAcceptDiscussionLoading({
        state: true
      });
      buttonFlag = true;
    }
  };

  const changeToDiscussionPage = () => {
    let flag = false;

    props.onlineUsersList.forEach(userObject => {
      if (userObject.name == props.selectedRequest.from) {
        flag = true;
      }
    });

    if (flag) {
      props.socket.emit("reqIsAvailableForDiscussion", {
        from: authContext.user.name,
        to: props.selectedRequest.from
      });

      changeButtonVariable();
      props.socket.on("availabilityStatus", data => {
        if (data.status) {
          props.setUser(data.from);
          navbarContext.toDiscussionPage();
          props.socket.emit("reqChangeToDiscussionPage", {
            from: data.to,
            to: data.from
          });
          props.handleInitiator();
        } else {
          changeButtonVariable();
          alert("User is busy at the moment. Try again later.");
        }
      });
    } else {
      changeButtonVariable();
      alert("User not online at the moment. Please try later");
      changeButtonVariable();
    }
  };

  const deleteRequest = async () => {
    props.removeSelectedRequest();

    props.updateList(props.selectedRequest.id);
    changeDeletedRequest(true);
    try {
      await axios.delete("/requests", {
        data: {
          id: props.selectedRequest.id,
          name: authContext.user.name
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.selectedRequest) {
      changeDeletedRequest(false);
      changeLoading(true);
      axios
        .get("/userinfo", {
          params: { name: props.selectedRequest.from }
        })
        .then(response => {
          userDataFromDB = response.data[0];
          changeLoading(false);
        });
    }
  }, [props.selectedRequest]);

  if (!props.allRequestsState.length) {
    return <h4>You have no requests...</h4>;
  }

  if (props.selectedRequest) {
    if (deletedRequest) {
      return <h4>Click on a request...</h4>;
    }
    if (loading) {
      return (
        <div className={styles.requestsLoadingContainer}>
          <p>Please wait...</p>

          <HashLoader color={"#fcba04"} size={15}></HashLoader>
        </div>
      );
    } else {
      return (
        <div>
          <img
            src="https://api.adorable.io/avatars/285/abott@adorable.png"
            alt=""
            style={imgStyle}
          />
          <div style={namebiocontainer}>
            <p style={name}>{props.selectedRequest.from}</p>

            <p style={bio}>{userDataFromDB.bio}</p>
          </div>
          <p style={sendreq}>Request Message:</p>
          <h5>{props.selectedRequest.reqMsg}</h5>

          {acceptDiscussionLoading.state ? (
            <React.Fragment>
              <Button
                variant="contained"
                color="primary"
                style={acceptButton}
                onClick={() => {
                  changeToDiscussionPage();
                }}
                disabled={true}
              >
                <CircularProgress size={16} style={yellowColor} />{" "}
                <span>&nbsp;&nbsp;</span>
                Accept
              </Button>
            </React.Fragment>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={acceptButton}
              onClick={() => {
                changeToDiscussionPage();
              }}
            >
              Accept
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            style={deleteButton}
            disabled={acceptDiscussionLoading.state}
            onClick={deleteRequest}
          >
            Delete Request
          </Button>
          <p>(Note: User needs to be online to connect)</p>
        </div>
      );
    }
  } else {
    return <h4>Click on a request...</h4>;
  }
}

export default IndividualRequest;
