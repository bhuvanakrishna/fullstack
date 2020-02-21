import React, { useState, useEffect } from "react";
import adapter from "webrtc-adapter";

const Discuss = () => {
  let localStream = null;
  let remoteStream = null;
  let localPeerConnection;
  let remotePeerConnection;
  const getLocalVideo = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    document.querySelector(".myVideo").srcObject = localStream;
    // changeLocalVideoUrl(stream);
  };
  getLocalVideo();

  const getRemoteVideo = async () => {
    remoteStream = await navigator.mediaDevices.getUserMedia({
      video: true
      // audio: true,
    });
    document.querySelector(".otherVideo").srcObject = remoteStream;
  };

  const offerOptions = {
    offerToReceiveVideo: 1
  };

  function handleConnection(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = getOtherPeer(peerConnection);

      otherPeer
        .addIceCandidate(newIceCandidate)
        .then(() => {
          // handleConnectionSuccess(peerConnection);
        })
        .catch(error => {
          // handleConnectionFailure(peerConnection, error);
        });
    }
  }

  function handleConnectionChange(event) {
    const peerConnection = event.target;
    console.log("ICE state change event: ", event);
  }

  function setDescriptionSuccess(peerConnection, functionName) {
    const peerName = getPeerName(peerConnection);
  }

  function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, "setLocalDescription");
  }

  function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, "setRemoteDescription");
  }

  function createdOffer(description) {
    localPeerConnection.setLocalDescription(description).then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    });
    // .catch(setSessionDescriptionError);

    remotePeerConnection.setRemoteDescription(description).then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
    });
    // .catch(setSessionDescriptionError);

    remotePeerConnection.createAnswer().then(createdAnswer);
    // .catch(setSessionDescriptionError);
  }

  function createdAnswer(description) {
    remotePeerConnection.setLocalDescription(description).then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    });
    // .catch(setSessionDescriptionError);

    localPeerConnection.setRemoteDescription(description).then(() => {
      setRemoteDescriptionSuccess(localPeerConnection);
    });
    // .catch(setSessionDescriptionError);
  }

  //create peer connection. the main function

  function createPeerConnection() {
    const servers = null; // Allows for RTC server configuration.

    // Create peer connections and add behavior.
    localPeerConnection = new RTCPeerConnection(servers);

    localPeerConnection.addEventListener("icecandidate", handleConnection);
    localPeerConnection.addEventListener(
      "iceconnectionstatechange",
      handleConnectionChange
    );

    remotePeerConnection = new RTCPeerConnection(servers);

    remotePeerConnection.addEventListener("icecandidate", handleConnection);
    remotePeerConnection.addEventListener(
      "iceconnectionstatechange",
      handleConnectionChange
    );
    remotePeerConnection.addEventListener("addstream", getRemoteVideo);

    // Add local stream to connection and create offer to connect.
    localPeerConnection.addStream(localStream);

    localPeerConnection
      //change offer options to get audio of the other end
      .createOffer(offerOptions)
      .then(createdOffer);
    // .catch(setSessionDescriptionError);
  }

  //end discussion or call

  function hangupAction() {
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    // hangupButton.disabled = true;
    // callButton.disabled = false;
    // trace('Ending call.');
  }

  function getOtherPeer(peerConnection) {
    return peerConnection === localPeerConnection
      ? remotePeerConnection
      : localPeerConnection;
  }

  function getPeerName(peerConnection) {
    return peerConnection === localPeerConnection
      ? "localPeerConnection"
      : "remotePeerConnection";
  }
  return (
    <div>
      <h1>Discuss page</h1>

      <button onClick={createPeerConnection}>Start Discussion</button>

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

      <button onClick={hangupAction}>End Discussion</button>
    </div>
  );
};

export default Discuss;
