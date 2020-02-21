import React, { useState, useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AuthContext from "../../context/auth/authContext";
import NavbarContext from "../../context/navbar/navbarContext";
import RequestImage from "../assets/request.svg";
import styles from "../pages/Searchusers.module.css";
import HashLoader from "react-spinners/ScaleLoader";
import axios from "axios";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
// import AuthContext from "../../context/auth/authContext";

// import Button from "@material-ui/core/Button";

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

const reqmsgpadding = {
  paddingBottom: "2%"
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

const requestImage = {
  maxHeight: "100%",
  maxWidth: "100%"
};

const requestImageContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
  // Height: "100%",
  // Width: "100%"
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

  console.log("from individual request component:");
  console.log(props.selectedRequest);

  const [loading, changeLoading] = useState(true);

  const changeToDiscussionPage = () => {
    let flag = false;
    //check if the user is online
    props.onlineUsersList.forEach(userObject => {
      if (userObject.name == props.selectedRequest.from) {
        flag = true;
      }
    });
    console.log("online users array:");
    console.log(props.onlineUsersList);
    console.log("selected request");
    console.log(props.selectedRequest);
    if (flag) {
      // props.socket.emit("toDiscussionPageRequest", {requestFrom: authContext.user.name});
      //ask the status if the other user is on discussion page
      props.socket.emit("reqIsAvailableForDiscussion", {
        from: authContext.user.name,
        to: props.selectedRequest.from
      });

      console.log("emitted req. if the other user is online");
      props.socket.on("availabilityStatus", data => {
        console.log("got status if the other user is online or not");
        if (!data.status) {
          navbarContext.toDiscussionPage();
          props.socket.emit("reqChangeToDiscussionPage", {
            from: data.to,
            to: data.from
          });
        }
      });
    } else {
      alert("User not online at the moment. Please try later");
    }
  };

  useEffect(() => {
    if (props.selectedRequest) {
      changeLoading(true);
      axios
        .get("/userinfo", {
          params: { name: props.selectedRequest.from }
        })
        .then(response => {
          console.log("response from userinfo api");

          userDataFromDB = response.data[0];
          console.log(userDataFromDB);
          changeLoading(false);
        });
    }
  }, [props.selectedRequest]);

  // useEffect(() => {
  //   if (userDataFromDB) {
  //     changeLoading(false);
  //   }
  // }, [userDataFromDB]);

  //   const authContext = useContext(AuthContext);

  if (props.selectedRequest) {
    console.log("inside individual request");
    console.log(props.selectedRequest);
  }

  const classes = useStyles();
  // console.log("individual user:");
  // console.log(props.individualUser);
  // console.log("list of users");
  // console.log(props.list);

  if (props.selectedRequest) {
    if (loading) {
      return (
        <div className={styles.requestsLoadingContainer}>
          {/* <div style={requestImageContainer}> */}
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
            {/* <p style={name}>ABC</p> */}
            <p style={bio}>
              {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at
              fugit consequatur, quam eligendi quasi illum aspernatur ducimus in,
              saepe dolor et minus dolorum quaerat aut alias quo assumenda eaque. */}
              {/* {props.individualUser.bio} */}
              {/* bio of abc */}
              {userDataFromDB.bio}
            </p>
          </div>
          <p style={sendreq}>Request Message:</p>
          <h5>{props.selectedRequest.reqMsg}</h5>
          {/* <Link to="/discuss" style={{ textDecoration: "none" }}> */}
          <Button
            variant="contained"
            color="primary"
            style={acceptButton}
            onClick={changeToDiscussionPage}
          >
            Accept
          </Button>
          {/* </Link> */}

          <Button variant="contained" color="primary" style={deleteButton}>
            Delete Request
          </Button>
          <p>(Note: User needs to be online to connect)</p>
        </div>
      );
    }
  } else {
    return (
      <div className={styles.requestImageDiv}>
        <img src={RequestImage} style={requestImage} />
      </div>
    );
  }
}

export default IndividualRequest;
