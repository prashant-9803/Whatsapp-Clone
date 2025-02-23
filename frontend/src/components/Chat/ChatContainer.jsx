import React from "react";
import { useSelector } from "react-redux";
import { calculateTime } from "../../utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import PdfMessage from "./PdfMessage";
import VoiceMessage from "./VoiceMessage";

const ChatContainer = () => {
  const { messages } = useSelector((state) => state.message);

  const { currentChatUser } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0 "></div>
      <div className="mx-6 my-8 relative bottom-0 z-40 left-0 ">
        <div className="flex w-full ">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto ">
            {/* allmessage */}
            {messages.map((message, index) => {
              return (
                <div
                  key={message._id}
                  className={`${
                    message.sender._id === currentChatUser._id
                      ? "flex justify-start"
                      : "flex justify-end"
                  }`}
                >
                  {message.type === "text" && (
                    <div
                      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                        message.sender._id === currentChatUser._id
                          ? "bg-incoming-background"
                          : "bg-outgoing-background"
                      }`}
                    >
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end ">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit ">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.sender._id === user._id && (
                            <MessageStatus messageStatus={message.status} />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {message.type === "image" && (
                    <ImageMessage message={message} />
                  )}
                  {message.type === "file" && <PdfMessage message={message} />}

                  {message.type === "audio" && <VoiceMessage message={message} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
