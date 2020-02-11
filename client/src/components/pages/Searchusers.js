import React from "react";
import Navbar from "../layout/Navbar";
import styles from "./Searchusers.module.css";
import Footer from "../layout/Footer";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import OnlineUsersList from "../layout/OnlineUsersList";
import IndividualUser from "../layout/IndividualUser";

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

  // cssOutlinedInput: {
  //   // "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //   //   borderColor: "black" //default
  //   // },
  //   "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "black" //default
  //   },
  //   "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "#fcba04" //hovered
  //   },
  //   "&$cssFocused $notchedOutline": {
  //     borderColor: "#fcba04 !important" //focused
  //   },
  //   "&$cssFocused $notchedOutline": {
  //     borderColor: `green !important`
  //   }
  // },

  // cssFocused: {
  //   "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "#fcba04 !important" //default
  //   },
  //   "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "#fcba04 !important" //hovered
  //   },
  //   "&$cssFocused $notchedOutline": {
  //     borderColor: "green !important" //focused
  //   }
  // },
  // notchedOutline: {
  //   "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "black" //default
  //   },
  //   "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
  //     borderColor: "#fcba04 !important" //hovered
  //   },
  //   "&$cssFocused $notchedOutline": {
  //     borderColor: "#fcba04 !important" //focused
  //   }
  // "&:after": {
  //   borderColor: ["white, !important"]
  // }
  // }
  // borderWidth: "1px",
  // borderColor: "#fcba04 !important"
});

const Searchusers = props => {
  const classes = useStyles();

  return (
    <div>
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
