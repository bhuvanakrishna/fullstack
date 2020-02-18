import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

function Socket() {
  const [variables, setVariables] = useState({
    response: 0,
    endpoint: "http://localhost:5000"
  });

  useEffect(() => {
    const socket = socketIOClient(variables.endpoint);

    // socket.on

    // return () => {
    //   cleanup;
    // };
  });

  //   socket.on("connect", () => {
  //     socket
  //       .emit("authenticate", { token: token }) //send the jwt
  //       .on("authenticated", () => {
  //         //do other things
  //       })
  //       .on("unauthorized", msg => {
  //         console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
  //         // throw new Error(msg.data.type);
  //       });
  //   });

  return <div></div>;
}

export default Socket;
