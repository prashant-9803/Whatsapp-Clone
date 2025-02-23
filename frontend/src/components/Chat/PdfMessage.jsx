import React from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../utils/ApiRoutes";
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "../../utils/CalculateTime";

// Function to extract the original file name
const getOriginalFileName = (filePath) => {
    // Remove the fixed prefix ("uploads/images/")
    let fileName = filePath.replace("uploads/images/", "");
  
    // Remove the fixed-length timestamp (assume timestamp is always 13 characters)
    return fileName.substring(13);
  };
const PdfMessage = ({ message }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className={`p-1 px-3 rounded-lg ${
        message.sender._id === user._id
          ? "bg-outgoing-background"
          : "bg-incoming-background"
      }`}
    >
      <div className="relative flex items-center gap-2 p-2 rounded-lg">
        {/* PDF Thumbnail */}
        <img
          src="/pdf-logo.png"
          className="w-12 h-12"
          alt="PDF Thumbnail"
        />

        {/* PDF File Name with Link */}
        <a
          href={`${SERVER_URL}/${message.message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline truncate max-w-[200px]"
        >
          {getOriginalFileName(message.message)}
        </a>

        {/* Timestamp & Message Status */}
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
          </span>
          <span className="text-bubble-meta">
            {message.sender._id === user._id && (
              <MessageStatus messageStatus={message.status} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfMessage;
