import React, { useContext, useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import styles from "./Searchusers.module.css";
import Footer from "../layout/Footer";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import OnlineUsersList from "../layout/OnlineUsersList";
import IndividualUser from "../layout/IndividualUser";
import AuthContext from "../../context/auth/authContext";
import Socket from "../sockets/Socket";
import socketIOClient from "socket.io-client";

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

  let { user, isAuthenticated, loading } = authContext;

  const [socketState, setSocketState] = useState({
    socket: null
  });

  useEffect(() => {
    let loadUserFunction = async () => {
      await authContext.loadUser();
    };
    loadUserFunction();
  }, []);

  useEffect(() => {
    if (user !== null) {
      const socket = socketIOClient("http://localhost:5000");
      socket.once("connect", () => {
        console.log("Connected!!");
      });

      setSocketState((socketState.socket = socket));
    }
  }, [user]);

  const classes = useStyles();

  return (
    <div>
      {/* <Socket></Socket> */}
      <Navbar></Navbar>
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
              />
            </form>
            <OnlineUsersList></OnlineUsersList>
          </div>
        </div>
        <div className={styles.showUsers}>
          <div className={styles.showusersinternal}>
            <IndividualUser></IndividualUser>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Searchusers;
