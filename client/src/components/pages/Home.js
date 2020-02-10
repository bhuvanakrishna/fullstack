import React, { useState, useContext, useEffect } from "react";
// import { useTheme } from "@material-ui/core/styles";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import Image from "../assets/connect.svg";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  makeStyles
  // MuiThemeProvider,
  // createMuiTheme
} from "@material-ui/core/styles";
// import green from "@material-ui/core/colors/green";
// import FormHelperText from "@material-ui/core/FormHelperText";

import Registration from "../layout/Registration";

import AuthContext from "../../context/auth/authContext";

const useStyles = makeStyles(theme => ({
  margin20: {
    margin: "20px"
  },
  input: {
    color: "white"
  },
  underlinewhite: {
    "&:before": {
      borderBottomColor: "black"
    },
    "&:after": {
      borderBottomColor: "white"
    },
    "&:hover:before": {
      //   borderBottomColor: ["white", "!important"]
    }
  },
  whitelabel: {
    color: ["white", "!important"]
  },
  underlineblack: {
    "&:before": {
      borderBottomColor: "black"
    },
    "&:after": {
      borderBottomColor: "black"
    },
    "&:hover:before": {
      //   borderBottomColor: ["white", "!important"]
    }
  },
  blacklabel: {
    color: ["black", "!important"]
  }
  //   floatingLabelFocusStyle: {
  //     color: "white"
  //   }
}));

const Home = () => {
  const authContext = useContext(AuthContext);

  const { registerAction } = authContext;

  const classes = useStyles();

  const [login, setLogin] = useState({
    loginemail: "",

    loginpassword: ""
  });

  const { loginemail, loginpassword } = login;

  const onLoginChange = e => {
    setLogin({ ...login, [e.target.name]: [e.target.value] });
  };

  const loginSubmit = e => {
    e.preventDefault();
    console.log("login submit");
  };

  return (
    <div className="container">
      {/* <div className="banner">
        <p id="main-heading">E-VID BOARD</p>
        <p id="sub-heading">Connect to your friends and discuss...</p>
        {xs && <p>you are on xs device</p>}
        {sm && <p>you are on sm device</p>}
        {md && <p>you are on md device</p>}
        {lg && <p>you are on lg device</p>}
        {xl && <p>you are on xl device</p>} 
      </div>*/}

      <div id="header">
        <p id="mainheading">E-VID BOARD</p>
        <p id="subheading">Connect with your friends and discuss...</p>
      </div>
      <div id="mainleft">
        <img id="mainpageimage" src={Image} alt="" />
      </div>

      <div id="logindiv">
        <div id="loginformdiv">
          <form onSubmit={loginSubmit}>
            <TextField
              id="filled-basic"
              label="Email"
              variant="filled"
              className={classes.margin20}
              classes={{ focused: classes.textfield }}
              InputProps={{
                className: classes.underlinewhite
              }}
              InputLabelProps={{
                className: classes.whitelabel
              }}
              value={loginemail}
              onChange={onLoginChange}
              name="loginemail"
            />
            <TextField
              color="white"
              id="filled-basic"
              label="Password"
              variant="filled"
              className={classes.margin20}
              InputProps={{
                className: classes.underlinewhite
              }}
              InputLabelProps={{
                className: classes.whitelabel
                // focussed: classes.whitelabel
              }}
              type="password"
              value={loginpassword}
              onChange={onLoginChange}
              name="loginpassword"
            />
            <Button
              variant="outlined"
              className={classes.margin20}
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>

        <div id="loginError">
          {/* <p>Invalid credentials. Please try again.</p> */}
        </div>

        <hr />
        <hr />
      </div>

      <div id="mainright">
        <div id="mainrightinternal">
          <div id="createaccountpdiv">
            <p id="createaccountp">Create an Account:</p>
          </div>
          <div id="registerdiv">
            <Registration></Registration>
          </div>
        </div>
      </div>

      <div id="footer">
        <p>Created by Bhuvana Krishna</p>
        <p>Email: bhuvanakrishna95@gmail.com</p>
      </div>
    </div>
  );
};

export default Home;
