import React, { useState, useEffect, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AuthContext from "../../context/auth/authContext";

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

const sendreqbutton = {
  background: "#fcba04",
  width: "200px"
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

function IndividualUser(props) {
  const authContext = useContext(AuthContext);

  const [reqMsgState, changeReqMsgState] = useState("");

  const sendReqFunction = e => {
    e.preventDefault();
    console.log("inside send req function");
    if (props.socket) {
      props.socket.emit("requestTo", {
        room: props.individualUser.name,
        from: authContext.user.name,
        msg: reqMsgState
      });
    }
  };

  const updateReqMessage = e => {
    // e.preventDefault();
    changeReqMsgState(e.target.value);
  };

  useEffect(() => {
    // console.log("req msg:");
    // console.log(reqMsgState);
    // console.log("socket:");
    // if (props.socket) {
    //   props.socket.emit("requestTo", {
    //     room: props.individualUser.name,
    //     msg: reqMsgState
    //   });
    // }
  }, [reqMsgState]);

  const classes = useStyles();
  // console.log("individual user:");
  // console.log(props.individualUser);
  // console.log("list of users");
  // console.log(props.list);
  if (
    !props.individualUser
    // || !props.list.includes(props.individualUser)
  ) {
    return <h4>Please select an online user to start discussion.</h4>;
  } else if (props.list.includes(props.individualUser)) {
    return (
      <div>
        <img
          src="https://api.adorable.io/avatars/285/abott@adorable.png"
          alt=""
          style={imgStyle}
        />
        <div style={namebiocontainer}>
          <p style={name}>{props.individualUser.name}</p>
          <p style={bio}>
            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at
            fugit consequatur, quam eligendi quasi illum aspernatur ducimus in,
            saepe dolor et minus dolorum quaerat aut alias quo assumenda eaque. */}
            {props.individualUser.bio}
          </p>
        </div>
        <p style={sendreq}>Send Request:</p>
        <form>
          <TextField
            id="standard-multiline-static"
            label="Request Message"
            variant="filled"
            fullWidth
            required
            helperText="(Max 100 characters)"
            inputProps={{ maxLength: 100 }}
            style={reqmsgpadding}
            InputProps={{
              className: classes.underlineyellow
            }}
            InputLabelProps={{
              className: classes.blacklabel
            }}
            onChange={updateReqMessage}
          />
          <Button
            variant="contained"
            style={sendreqbutton}
            type="submit"
            onClick={sendReqFunction}
          >
            Send
          </Button>
        </form>
      </div>
    );
  } else return null;
}

export default IndividualUser;
