import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_IMAGE_MESSAGE_ROUTE,
  ADD_MESSAGE_ROUTE,
} from "../../utils/ApiRoutes";
import { SocketContext } from "../../context/SocketContext";
import { addMessage } from "../../slices/messageSlice";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import CaptureAudio from "../common/CaptureAudio";


const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const { socket } = useContext(SocketContext);
  const { currentChatUser } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const emojiPickerRef = useRef(null);

  const photoPickerChange = async (e) => {
    try {
      console.log(e.target.files[0]);
      const file = e.target.files[0];

      let formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: user._id,
          to: currentChatUser._id,
        },
      });

      if (response.data.success) {
        socket.current.emit("send-msg", {
          from: user?._id,
          to: currentChatUser?._id,
          message: response.data.message,
        });

        console.log(response.data);
        dispatch(
          addMessage({
            ...response.data.message,
            fromSelf: true,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        from: user?._id,
        to: currentChatUser?._id,
        message,
      });

      socket.current.emit("send-msg", {
        from: user?._id,
        to: currentChatUser?._id,
        message: data.message,
      });

      dispatch(
        addMessage({
          ...data.message,
          fromSelf: true,
        })
      );

      setMessage("");
    } catch (error) {
      console.log("error while sending message controller", error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative ">
      {!showAudioRecorder && (
        <>
          
          <div className="flex gap-6 ">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-24 left-16 z-40"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
            />
          </div>
          <div className="w-full rounded-lg flex items-center h-10">
            <input
              type="text"
              placeholder="Type a Message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="w-10 items-center flex justify-center">
            <button>
              {message.length ? (
                <MdSend
                  onClick={sendMessage}
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send message"
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
          
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
};

export default MessageBar;
