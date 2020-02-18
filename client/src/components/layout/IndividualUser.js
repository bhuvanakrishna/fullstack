import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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

function IndividualUser() {
  const classes = useStyles();

  return (
    <div>
      <img
        src="https://api.adorable.io/avatars/285/abott@adorable.png"
        alt=""
        style={imgStyle}
      />
      <div style={namebiocontainer}>
        <p style={name}>Bhuvana Krishna</p>
        <p style={bio}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro at
          fugit consequatur, quam eligendi quasi illum aspernatur ducimus in,
          saepe dolor et minus dolorum quaerat aut alias quo assumenda eaque.
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
        />
        <Button variant="contained" style={sendreqbutton} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}

export default IndividualUser;
