import React, { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AuthContext from "../../context/auth/authContext";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
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
    color: "#fcba04"
  }
});

class Registration extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      registerEmail: "",
      registerName: "",
      registerPassword1: "",
      registerPassword2: "",
      registerEmailError: false,
      registerNameError: false,
      registerPasswordLengthError: false,
      registerPasswordNotSameError: false,
      registerEmailErrorMsg: "",
      registerNameErrorMsg: "To be displayed to others",
      registerPasswordLengthErrorMsg: "Minimum 5 characters",
      registerPasswordNotSameErrorMsg: "",
      registerLoading: false
    };
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleRegisterChange = this.handleRegisterChange.bind(this);
    this.closeRegistrationCompleteDialog = this.closeRegistrationCompleteDialog.bind(
      this
    );
    this.openRegistrationCompleteDialog = this.openRegistrationCompleteDialog.bind(
      this
    );
    this.previousContext = "";
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.previousContext = this.context;
  }

  componentDidUpdate() {
    if (this.previousContext.error !== this.context.error) {
      if (this.context.error === "Mail Already Registered") {
        this.setState({
          registerEmailErrorMsg: "Mail Already Registered",
          registerEmailError: true
        });
      } else if (this.context.error === "Username Already Taken") {
        this.setState({
          registerNameErrorMsg: "Username Already Taken",
          registerNameError: true
        });
      }
      // console.log(
      //   "from component did update, loading value: " +
      //     this.state.registerLoading
      // );

      this.setState({
        registerLoading: false
      });

      // console.log(
      //   "from component did update, loading value 2: " +
      //     this.state.registerLoading
      // );

      // this.context.toggleLoading();

      this.context.clearErrors();

      this.previousContext = this.context;
    }
  }

  handleRegisterChange = e => {
    //   setRegister({ ...register, [e.target.name]: [e.target.value] });
    this.setState({ [e.target.name]: [e.target.value] });
  };

  handleRegisterSubmit = e => {
    e.preventDefault();
    const { registerAction, error } = this.context;

    // console.log("error: " + error);

    // console.log("register submit entered");

    this.setState({
      registerEmailError: false,
      registerNameError: false,
      registerPasswordLengthError: false,
      registerPasswordNotSameError: false,
      registerEmailErrorMsg: "",
      registerNameErrorMsg: "To be displayed to others",
      registerPasswordLengthErrorMsg: "Minimum 5 characters",
      registerPasswordNotSameErrorMsg: ""
      // registerLoading: true
    });

    // console.log("Email field: " + this.state.registerEmail);

    // console.log("Start of register: " + this.state.registerLoading);

    if (this.state.registerEmail == "") {
      this.setState({
        registerEmailErrorMsg: "Enter Email",
        registerEmailError: true
      });
    } else if (this.state.registerName == "") {
      this.setState({
        registerNameErrorMsg: "Enter a Name",
        registerNameError: true
      });
    } else if (this.state.registerPassword1 == "") {
      this.setState({
        registerPasswordLengthErrorMsg: "Enter a Password",
        registerPasswordLengthError: true
      });
    } else if (this.state.registerPassword2 == "") {
      this.setState({
        registerPasswordNotSameErrorMsg:
          "Enter Password again for confirmation",
        registerPasswordNotSameError: true
      });
    } else if (this.state.registerPassword1.toString().length < 5) {
      // console.log(this.state.registerPassword1.toString().length);
      this.setState({
        registerPasswordLengthErrorMsg: "Password length is less than 5",
        registerPasswordLengthError: true
      });
    } else if (
      this.state.registerPassword1.toString() !==
      this.state.registerPassword2.toString()
    ) {
      this.setState({
        registerPasswordNotSameErrorMsg: "Passwords didn't match",
        registerPasswordNotSameError: true
      });
    } else {
      this.setState({
        registerLoading: true
      });
      registerAction({
        registerEmail: this.state.registerEmail,
        registerName: this.state.registerName,
        registerPassword1: this.state.registerPassword1
      });

      // console.log("End of register: " + this.state.registerLoading);

      // this.context.toggleLoading();
    }
  };

  openRegistrationCompleteDialog() {
    this.context.openDialog();
  }

  closeRegistrationCompleteDialog() {
    this.context.closeDialog();
    this.setState({
      registerLoading: false
    });
    window.location.reload();
  }

  render() {
    // const classes = useStyles();
    const { classes } = this.props;

    // console.log("from render, loading value: " + this.context.loading);

    return (
      <React.Fragment>
        <form onSubmit={this.handleRegisterSubmit}>
          <TextField
            // id="standard-basic"
            label="Email"
            className={classes.margin20}
            InputProps={{
              className: classes.underlineblack
            }}
            InputLabelProps={{
              className: classes.blacklabel
            }}
            value={this.state.registerEmail}
            onChange={this.handleRegisterChange}
            name="registerEmail"
            // error={this.state.registerEmailError || mailErrorFlag}
            // helperText={this.state.registerEmailErrorMsg || mailErrorMsg}
            error={this.state.registerEmailError}
            helperText={this.state.registerEmailErrorMsg}
          />
          <br />
          <TextField
            // id="standard-basic"
            label="Username"
            className={classes.margin20}
            // helperText="To be displayed to others"
            InputProps={{
              className: classes.underlineblack
            }}
            InputLabelProps={{
              className: classes.blacklabel
            }}
            value={this.state.registerName}
            onChange={this.handleRegisterChange}
            name="registerName"
            //   error={registererrors.registernameerror}
            //   helperText={registererrors.registernameerrormsg}
            // error={this.state.registerNameError || nameErrorFlag}
            // helperText={this.state.registerNameErrorMsg || nameErrorMsg}
            error={this.state.registerNameError}
            helperText={this.state.registerNameErrorMsg}
          />
          <br />
          <TextField
            // id="standard-basic"
            label="Password"
            className={classes.margin20}
            helperText="Minimum 5 characters"
            InputProps={{
              className: classes.underlineblack
            }}
            InputLabelProps={{
              className: classes.blacklabel
            }}
            value={this.state.registerPassword1}
            onChange={this.handleRegisterChange}
            type="password"
            name="registerPassword1"
            //   error={registererrors.registerpasswordlengtherror}
            //   helperText={registererrors.registerpasswordlengtherrormsg}
            error={this.state.registerPasswordLengthError}
            helperText={this.state.registerPasswordLengthErrorMsg}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Confirm Password"
            className={classes.margin20}
            InputProps={{
              className: classes.underlineblack
            }}
            InputLabelProps={{
              className: classes.blacklabel
            }}
            value={this.state.registerPassword2}
            onChange={this.handleRegisterChange}
            type="password"
            name="registerPassword2"
            //   error={registererrors.registerpasswordnotsameerror}
            //   helperText={registererrors.registerpasswordnotsameerrormsg}
            error={this.state.registerPasswordNotSameError}
            helperText={this.state.registerPasswordNotSameErrorMsg}
          />
          <br />

          <Button
            variant="contained"
            color="primary"
            className={classes.margin20}
            type="submit"
          >
            {this.state.registerLoading ? (
              <React.Fragment>
                <CircularProgress
                  size={16}
                  classes={{ colorPrimary: classes.yellowColor }}
                />{" "}
                <span>&nbsp;&nbsp;</span>
                {/* // Size 14 works pretty well */}
                <Typography>Register</Typography>
              </React.Fragment>
            ) : (
              <Typography>Register</Typography>
            )}
            {/* Register */}
          </Button>
        </form>

        {/* code for alert box after registration is complete  */}

        {/* {this.context.isAuthenticated
          ? this.openRegistrationCompleteDialog
          : this.closeRegistrationCompleteDialog} */}
        <Dialog
          // open={this.state.registratonComplete}
          open={this.context.registrationCompleteDialog}
          onClose={this.closeRegistrationCompleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Registration Successful!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check your mail for confirmation link.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeRegistrationCompleteDialog}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Registration);
