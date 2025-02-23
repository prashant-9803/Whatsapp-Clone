import React from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../utils/ApiRoutes";
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "../../utils/CalculateTime";

const ImageMessage = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentChatUser } = useSelector((state) => state.ui);

  return (
    <div
      className={`p-1 rounded-lg ${
        message.sender._id === user._id
          ? "bg-outgoing-background"
          : "bg-incoming-background"
      }`}
    >
      <div className="relative">
        <img
          src={`${SERVER_URL}/${message.message}`}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1 ">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit ">
            {calculateTime(message.createdAt)}
          </span>
          <span className="text-bubble-meta ">
            {message.sender._id === user._id && (
              <MessageStatus messageStatus={message.status} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageMessage;
