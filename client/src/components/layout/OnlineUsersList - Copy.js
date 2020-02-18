import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { FixedSizeList } from "react-window";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: 400,
    paddingTop: "2%",
    // maxWidth: 300,
    backgroundColor: theme.palette.background.paper
  }
}));

// function myRenderRow(props) {
//   console.log("inside my render row:");
//   console.log(props);
//   return (
//     <ListItem>
//       {/* <ListItemIcon>{img}</ListItemIcon> */}
//       <span>&nbsp;&nbsp;</span>
//       <ListItemText primary={props.name} />
//     </ListItem>
//   );
// }

function renderRow(props) {
  console.log("inside renderrow");
  console.log(props);
  const { index, style } = props;
  const style2 = {
    // position: "absolute",
    // top: 0,
    // left: 0,
    height: 50,
    width: 50,
    borderRadius: "50%",
    border: "1px solid #fcba04"
  };
  const img = (
    <img
      src="https://api.adorable.io/avatars/285/abott@adorable.png"
      style={style2}
      className="class"
    />
  );
  // console.log(img);

  return (
    <ListItem button style={style} key={index}>
      <ListItemIcon>{img}</ListItemIcon>
      <span>&nbsp;&nbsp;</span>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};

export default function VirtualizedList(props) {
  const classes = useStyles();

  console.log("props of virtualized list: ");
  console.log(props.list);

  if (props.list) {
    return (
      <div className={classes.root}>
        <FixedSizeList
          height={400}
          width={"100%"}
          itemSize={60}
          itemCount={props.list.length}
        >
          {renderRow}
          {/* {myRenderRow} */}
        </FixedSizeList>
      </div>
    );
  } else {
    return (
      <div>
        <p>No users online</p>
      </div>
    );
  }
}
