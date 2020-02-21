import React, { useState, useEffect } from "react";
import adapter from "webrtc-adapter";

const Discuss = () => {
  return (
    <div>
      <h1>Discuss page</h1>

      {/* <button onClick={createPeerConnection}>Start Discussion</button> */}

      <video
        // src={localVideoUrl}
        autoPlay={true}
        playsInline
        className="myVideo"
      ></video>

      <video
        // src={localVideoUrl}
        autoPlay={true}
        playsInline
        className="otherVideo"
      ></video>

      {/* <button onClick={hangupAction}>End Discussion</button> */}
    </div>
  );
};

export default Discuss;
