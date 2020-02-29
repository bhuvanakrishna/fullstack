import React, { useState, useContext, useEffect } from "react";
import Image from "../assets/connect.svg";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

import Registration from "../layout/Registration";

import AuthContext from "../../context/auth/authContext";

import Footer from "../layout/Footer";

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
  },
  yellowColor: {
    color: "black"
  }
}));

const Home = props => {
  const authContext = useContext(AuthContext);

  const { login, error, clearErrors, isAuthenticated } = authContext;

  const [loginform, setLogin] = useState({
    loginemail: "",
    loginErrorMsg: "",
    loginpassword: ""
  });

  useEffect(() => {
    if (isAuthenticated === true) {
      props.history.push("/searchusers");
    }

    if (error == "Invalid Credentials") {
      setLogin({ ...loginform, loginErrorMsg: "Invalid Credentials" });
      clearErrors();
      changeLoginLoading(false);
    }
    //eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const classes = useStyles();

  const { loginemail, loginpassword } = loginform;

  const onLoginChange = e => {
    setLogin({ ...loginform, [e.target.name]: [e.target.value] });
  };

  const [loginLoading, changeLoginLoading] = useState(false);

  useEffect(() => {
    if (loginLoading) {
      if (loginform.loginemail == "" || loginform.loginpassword == "") {
        setLogin({
          ...loginform,
          loginErrorMsg: "Please enter your credentials."
        });
        changeLoginLoading(false);
      } else {
        const localLogin = async () => {
          login({
            email: loginform.loginemail,
            password: loginform.loginpassword
          }).then(response => {
            if (!response) {
              setLogin({
                ...loginform,
                loginErrorMsg: "User not found."
              });
              changeLoginLoading(false);
            } else {
              // console.log(response);
              changeLoginLoading(false);
            }
          });
        };

        localLogin();
      }
    }
  }, [loginLoading]);

  const loginSubmit = e => {
    e.preventDefault();

    changeLoginLoading(true);
  };

  return (
    <div className="container">
      <div id="header">
        <p id="mainheading">E-VID BOARD</p>
        <p id="subheading">Connect and discuss...</p>
      </div>
      <div id="mainleft">
        <img id="mainpageimage" src={Image} alt="" />
      </div>

      <div id="logindiv">
        <div id="loginformdiv">
          <form onSubmit={loginSubmit}>
            <TextField
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
              required
            />
            <TextField
              id="filled-basic"
              label="Password"
              variant="filled"
              className={classes.margin20}
              InputProps={{
                className: classes.underlinewhite
              }}
              InputLabelProps={{
                className: classes.whitelabel
              }}
              type="password"
              value={loginpassword}
              onChange={onLoginChange}
              name="loginpassword"
              required
            />
            <Button
              variant="outlined"
              className={classes.margin20}
              type="submit"
            >
              {loginLoading ? (
                <React.Fragment>
                  <CircularProgress
                    size={16}
                    classes={{ colorPrimary: classes.yellowColor }}
                  />
                  <span>&nbsp;&nbsp;</span>
                </React.Fragment>
              ) : null}
              Login
            </Button>
          </form>
        </div>

        <div id="loginError">
          <p>{loginform.loginErrorMsg}</p>
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

      <Footer></Footer>
    </div>
  );
};

export default Home;
