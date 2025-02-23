import React, { useContext, useEffect, useRef, useState } from "react";
import ChatList from "../components/Chatlist/ChatList";
import Empty from "../components/Empty";
import Chat from "../components/Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GET_MESSAGES_ROUTE } from "../utils/ApiRoutes";
import { addMessage, setMessages, setOnlineUsers, setSocket } from "../slices/messageSlice";
import { io } from "socket.io-client";
import { SERVER_URL } from "../utils/ApiRoutes";
import { SocketContext } from "../context/SocketContext";
import SearchMessages from "../components/Chat/SearchMessages";
import VideoCall from "../components/Call/VideoCall";
import VoiceCall from "../components/Call/VoiceCall";
import {
  setEndCall,
  setIncomingVideoCall,
  setIncomingVoiceCall,
  setVideoCall,
} from "../slices/uiSlice";
import IncomingVideoCall from "../components/common/IncomingVideoCall";
import IncomingCall from "../components/common/IncomingCall";

// var socket
const Home = () => {
  const {
    currentChatUser,
    videoCall,
    voiceCall,
    incomingVideoCall,
    incomingVoiceCall,
  } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { messageSearch } = useSelector((state) => state.message);
  const { setSocket } = useContext(SocketContext);

  const socket = useRef(null);
  const dispatch = useDispatch();

  const [socketEvent, setSocketEvent] = useState(false);

  useEffect(() => {
    //confusion about the && !secoketEvent condition
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        dispatch(
          addMessage({
            ...data.message,
            fromSelf: true,
          })
        );
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch(setIncomingVoiceCall({ from, roomId, callType }));
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch(setIncomingVideoCall({ from, roomId, callType }));
      });

      socket.current.on("voice-call-rejected", ({ from, roomId, callType }) => {
        dispatch(setEndCall());
      });

      socket.current.on("video-call-rejected", ({ from, roomId, callType }) => {
        dispatch(setEndCall());
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    if (user) {
      socket.current = io(SERVER_URL);
      socket.current.emit("add-user", user._id);
      setSocket(socket);
    }
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${user._id}/${currentChatUser._id}`
      );
      dispatch(setMessages(messages));
    };
    if (currentChatUser) getMessages();
  }, [currentChatUser]);

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
    )}

      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />

          {currentChatUser ? (
            <div
              className={
                messageSearch ? "grid grid-cols-2" : "grid grid-cols-1 "
              }
            >
              <Chat />
              {messageSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
