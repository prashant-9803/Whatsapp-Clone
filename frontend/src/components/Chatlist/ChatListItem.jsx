import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setContactsPage, setCurrentChatUser } from "../../slices/uiSlice";
import { calculateTime } from "../../utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

const ChatListItem = ({ data, isContactsPage = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentChatUser } = useSelector((state) => state.ui);

  const handleContactClick = () => {
    dispatch(setCurrentChatUser(data?._doc));
    dispatch(setContactsPage(false));
  };

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?._doc?.profilePicture} />
      </div>

      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full ">
        <div className="flex justify-between">
          <div>
            <span className="text-white ">{data?._doc?.name}</span>
          </div>
          {!isContactsPage && (
            <div>
              <span
                className={`${
                  !data?.totalUnreadMessages > 0
                    ? "text-secondary"
                    : "text-icon-green"
                } text-sm `}
              >
                {calculateTime(data?.createdAt)}
              </span>
            </div>
          )}
        </div>

        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2 ">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm ">
              {isContactsPage ? (
                data?._doc?.about || "\u00A0"
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data?.sender?._id === user?._id && (
                    <MessageStatus messageStatus={data?.status} />
                  )}
                  {
                    data?.type === "text" && <span className="truncate">{data?.message}</span>
                  }
                  {
                    data?.type === "audio" && (
                      <span className="flex gap-1 items-center "><FaMicrophone className="text-panel-header-icon "/>Audio</span>
                    )
                  }
                  {
                    data?.type === "image" && (
                      <span className="flex gap-1 items-center "><FaCamera className="text-panel-header-icon "/>Image</span>
                    )
                  }
                </div>
              )}
            </span>
            {
              data?.totalUnreadMessages > 0 && (
                <span className="bg-icon-green px-[5px] rounded-full text-sm">{data?.totalUnreadMessages}</span>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
