import React, { useRef, useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import NavbarContext from "../../context/navbar/navbarContext";
import styles from "../pages/Searchusers.module.css";
import Button from "@material-ui/core/Button";

function VideoChat(props) {
  // const [candidatesArray, changeCandidatesArray] = useState("");

  //styling

  const maxHeightWidth = {
    // maxHeight: "100px",
    // Width: "calc(100vw - 500px)"
    objectFit: "fill"
  };

  const authContext = useContext(AuthContext);
  const navbarContext = useContext(NavbarContext);

  const localVideoRef = useRef("");
  const remoteVideoRef = useRef("");

  if (props.socket) {
    props.socket.on("gotOffer", data => {
      // console.log("inside got offer");
      //step 1 of callee
      handleVideoOfferMsg(data);
    });

    props.socket.on("gotAnswer", data => {
      // console.log("inside got answer");
      handleGotAnswer(data);
    });

    // props.socket.on("gotCandidate", data => {
    //   handleNewICECandidateMsg(data);
    // });
  }

  let pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun2.1.google.com:19302"]
      }
    ]
  });

  let localStream = null;

  async function getLocalMedia() {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    localStream = stream;

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    let videoObj = localVideoRef.current;
    if (videoObj) {
      videoObj.srcObject = localStream;
    }
  }

  //for call initiator ie CALLER
  if (props.isInitiator) {
    //first get local stream

    getLocalMedia();
  }

  pc.onnegotiationneeded = async () => {
    // if (pc.signalingState != "stable") {
    //   console.log("     -- The connection isn't stable yet; postponing...");
    //   return;
    // }

    // if (localVideoRef.current.srcObject) {
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // }
  };

  pc.oniceconnectionstatechange = function(event) {
    if (pc.iceGatheringState === "complete") {
      send_sdp_to_remote_peer();
    }
  };

  pc.onicecandidate = function(event) {
    if (event.candidate === null) {
      return send_sdp_to_remote_peer();
    }
  };

  var isSdpSent = false;
  const send_sdp_to_remote_peer = () => {
    if (isSdpSent) return;
    isSdpSent = true;

    props.socket.emit("video-offer", {
      from: authContext.user.name,
      to: props.connectedTo,
      sdp: pc.localDescription
    });
  };

  const handleVideoOfferMsg = async msg => {
    //added *****************************

    // if (pc.signalingState == "stable") {
    //   return;
    // }

    //end of add *********************

    var desc = new RTCSessionDescription(msg.sdp);
    await pc.setRemoteDescription(desc);

    // let answer = await pc2.createAnswer();

    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    localStream = stream;

    localStream
      .getTracks()
      .forEach(async track => pc.addTrack(track, localStream));

    let videoObj = localVideoRef.current;
    if (videoObj) {
      videoObj.srcObject = localStream;
    }

    // videoObj.srcObject = stream;

    // if (stream) {

    // }

    let answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    props.socket.emit("video-answer", {
      from: authContext.user.name,
      to: props.connectedTo,
      sdp: pc.localDescription
    });
  };

  async function handleGotAnswer(msg) {
    // console.log("inside got answer");
    // if (pc1.signalingState == "stable") {
    //   // sdpArray.push(msg);
    //   console.log("negotiating");
    //   return;
    // }

    // console.log("state::");
    // console.log(pc.signalingState);

    //added *****************************
    if (pc.signalingState == "stable") {
      return;
    }

    //end of add ****************

    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  }

  pc.ontrack = function(event) {
    // console.log("inside on track of pc. ie the other end has added its tracks");
    let videoObj = remoteVideoRef.current;
    // if (videoObj.srcObject) {
    videoObj.srcObject = event.streams[0];
    // }

    // console.log(remoteVideoRef.current.srcObject);
  };

  //    async function handleNewICECandidateMsg(msg) {

  //           var candidate = new RTCIceCandidate(msg.candidate);

  //           await pc.addIceCandidate(candidate);

  //   }

  const handleDisconnect = () => {
    if (pc) {
      pc.ontrack = null;
      pc.onnegotiationneeded = null;

      let localvideoObj = remoteVideoRef.current;
      if (localvideoObj.srcObject) {
        localvideoObj.srcObject.getTracks().forEach(track => track.stop());
      }

      let remotevideoObj = localVideoRef.current;
      if (remotevideoObj.srcObject) {
        remotevideoObj.srcObject.getTracks().forEach(track => track.stop());
      }

      pc.close();
      pc = null;

      window.location.reload();
      navbarContext.toSearchUsersPage();

      // localStream.stop();
      //  localvideoObj.removeAttribute()
    }
  };

  return (
    <div className={styles.videosContainer}>
      <div>
        <video
          ref={remoteVideoRef}
          playsInline
          autoPlay
          // style={maxHeightWidth}
          className={styles.remoteVideo}
        ></video>
      </div>

      <div className={styles.localVideoDiv}>
        <video
          ref={localVideoRef}
          playsInline
          autoPlay
          muted
          // style={maxHeightWidth}

          className={styles.myVideo}
        ></video>
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            style={{ backgroundColor: "red", height: "50px" }}
            onClick={() => {
              handleDisconnect();
            }}
          >
            Disconnect
          </Button>
        </div>

        {/* <button>Disconnect</button> */}
      </div>
    </div>
  );
}

export default VideoChat;
