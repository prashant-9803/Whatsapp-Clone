import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
import { setMessageSearch } from "../../slices/messageSlice";
import { setExitChat, setVideoCall, setVoiceCall } from "../../slices/uiSlice";
import ContextMenu from "../common/ContextMenu";

const ChatHeader = () => {

  const { currentChatUser } = useSelector((state) => state.ui);
  const {onlineUsers} = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x:0,
    y:0
  })

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)

  const showContextMenu = (e) => {
    e.preventDefault();
    console.log("in the function")
    console.log(e)
    setContextMenuCordinates({
      x: e.pageX - 50,
      y: e.pageY + 20,
    });
    setIsContextMenuVisible(true);
  }

  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async() => {
        dispatch(setExitChat())
      }
    }
  ]


  const handleVoiceCall = () => {
    dispatch(
      setVoiceCall({
        ...currentChatUser,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      })
    );
  };

  const handleVideoCall = () => {
    dispatch(
      setVideoCall({
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      })
    );
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        {/* TODO */}
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {
              onlineUsers.includes(currentChatUser._id) ? "Online" : "Offline"
            }
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <MdCall onClick={handleVoiceCall} className="text-panel-header-icon cursor-pointer text-xl" />
        <IoVideocam onClick={handleVideoCall} className="text-panel-header-icon cursor-pointer text-xl" />
        <BiSearchAlt2
          onClick={() => dispatch(setMessageSearch())}
          className="text-panel-header-icon cursor-pointer text-xl"
        />
        <BsThreeDotsVertical id="context-opener" onClick={(e) =>{ 
          console.log("clicked");showContextMenu(e)}} className="text-panel-header-icon cursor-pointer text-xl" />
        {
          isContextMenuVisible && (
            <ContextMenu
              options={contextMenuOptions}
              coordinates={contextMenuCordinates}
              contextMenu={isContextMenuVisible}
              setContextMenu={setIsContextMenuVisible}
            />
          )
        }
      </div>
    </div>
  );
};

export default ChatHeader;
