import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/SocketContext'
import Container from './Container'


const VideoCall = () => {

  const {videoCall} = useSelector((state) => state.ui)
  const {user} = useSelector((state) => state.auth)
  const {socket} = useContext(SocketContext)

  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket.current.emit("outgoing-video-call", {
        to: videoCall._id,
        from: {
          _id: user._id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);

  return (
    <Container data={videoCall}/>
  )
}

export default VideoCall