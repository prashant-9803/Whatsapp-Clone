import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { setContactsPage } from "../../slices/uiSlice";
import { useNavigate } from "react-router-dom";
import ContextMenu from "../common/ContextMenu";

const ChatListHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();



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
      x: e.pageX,
      y: e.pageY,
    });
    setIsContextMenuVisible(true);
  }

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: async() => {
        setIsContextMenuVisible(false);
        navigate("/logout");
      }
    }
  ]




  const handleAllContactsPage = () => {
    dispatch(setContactsPage(true));
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center ">
      <div className="cursor-pointer">
        <Avatar type="sm" image={user?.profilePicture} />
      </div>
      <div>
        <div className="flex gap-6 ">
          <BsFillChatLeftTextFill
            className="text-panel-header-icon cursor-pointer text-xl "
            title="New chat"
            onClick={handleAllContactsPage}
          />
          <>
            <BsThreeDotsVertical
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
              className="text-panel-header-icon cursor-pointer text-xl "
              title="menu"
            />

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
          </>
        </div>
      </div>
    </div>
  );
};

export default ChatListHeader;
