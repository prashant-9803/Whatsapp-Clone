import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import Container from "./Container";

const VoiceCall = () => {
  const { voiceCall } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { socket } = useContext(SocketContext);


  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socket.current.emit("outgoing-voice-call", {
        to: voiceCall._id,
        from: {
          _id: user._id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);



  return <Container data={voiceCall} />;
};

export default VoiceCall;
