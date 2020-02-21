import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import NavbarContext from "../../context/navbar/navbarContext";
import AuthContext from "../../context/auth/authContext";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

export default function Navbar(props) {
  const navbarContext = useContext(NavbarContext);
  const authContext = useContext(AuthContext);

  // useEffect(() => {
  //   if (props.socket) {
  //     props.socket.on("requestFrom", function(data) {
  //       console.log("received msg from :");
  //       console.log(data.from);
  //       console.log("message is:");
  //       console.log(data.msg);
  //     });
  //   }
  // }, [props.socket]);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleNotifications = () => {
    // console.log(props.onClick);
    if (props.onClick) {
      props.onClick();
    }

    if (navbarContext.searchUsersPage || navbarContext.profilePage) {
      navbarContext.toRequestsPage();
    } else if (navbarContext.requestsPage) {
      navbarContext.toSearchUsersPage();
    }
  };

  const toggleProfilePage = () => {
    if (navbarContext.profilePage) {
      navbarContext.toSearchUsersPage();
    } else if (navbarContext.requestsPage || navbarContext.searchUsersPage) {
      navbarContext.toProfilePage();
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      //   id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {!navbarContext.profilePage ? (
        <MenuItem
          // onClick={handleMenuClose}
          onClick={toggleProfilePage}
        >
          My account
        </MenuItem>
      ) : null}
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#fcba04" }}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            E-VID BOARD
          </Typography>
          {navbarContext.profilePage ? (
            <IconButton color="inherit" onClick={toggleProfilePage}>
              <Typography variant="body1" className={classes.title}>
                Search Users
              </Typography>
            </IconButton>
          ) : null}
          {navbarContext.searchUsersPage || navbarContext.profilePage ? (
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={toggleNotifications}
            >
              <Typography variant="body1" className={classes.title}>
                Requests
              </Typography>
              <Badge badgeContent={props.requests} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          ) : null}
          {navbarContext.requestsPage ? (
            <IconButton
              // aria-label="show 17 new notifications"
              color="inherit"
              onClick={toggleNotifications}
            >
              <Typography variant="body1" className={classes.title}>
                Search Users
              </Typography>
              {/* <Badge badgeContent={17} color="secondary">
   <NotificationsIcon />
 </Badge> */}
            </IconButton>
          ) : null}

          <IconButton
            edge="end"
            aria-label="account of current user"
            // aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
