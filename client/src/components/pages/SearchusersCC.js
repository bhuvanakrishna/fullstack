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
import { withStyles } from "@material-ui/core/styles";

const styles2 = theme => ({
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

// function searchingFor(term) {
//   return function(x) {
//     return x.first.toLowerCase().includes(term.toLowerCase()) || !term;
//   };
// }

class SearchusersCC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onlineUsers: null,
      searchTerm: "",
      selectedUser: null
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.showIndividualUser = this.showIndividualUser.bind(this);
  }

  static contextType = AuthContext;

  componentDidMount() {
    let loadUserFunction = async () => {
      await this.context.loadUser();
      console.log(this.context.user);
      if (this.context.user) {
        const socket = socketIOClient("http://localhost:5000");
        socket.on("connect", () => {
          console.log("Connected!!");
          socket.emit("userconnected", this.context.user);

          socket.on("listofonline", list => {
            console.log("list of online users: ");

            this.setState({
              onlineUsers: list
            });
            // console.log(this.state.onlineUsers);
          });
        });

        // setSocketState((socketState.socket = socket));
      }
    };
    loadUserFunction();
  }

  onChangeSearch(e) {
    this.setState({ searchTerm: e.target.value });
    console.log("inside on change search");
  }

  showIndividualUser(user) {}
  render() {
    const { classes } = this.props;
    let filteredUsers;
    if (this.state.onlineUsers) {
      filteredUsers = this.state.onlineUsers.filter(user => {
        return (
          // user.name
          //   .toLowerCase()
          //   .indexOf(this.state.searchTerm.toLowerCase()) !== -1
          user.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        );
      });
    }

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
                  onChange={this.onChangeSearch}
                />
              </form>
              {this.state.onlineUsers ? (
                <OnlineUsersList
                  // list={this.state.onlineUsers}
                  list={filteredUsers}
                  // onClick={this.showIndividualUser}
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
              <IndividualUser></IndividualUser>
            </div>
          </div>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}

export default withStyles(styles2, { withTheme: true })(SearchusersCC);
