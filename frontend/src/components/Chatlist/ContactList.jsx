import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { setContactsPage, setCurrentChatUser } from "../../slices/uiSlice";

const ContactList = ({ data, isContactsPage = false }) => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const { currentChatUser } = useSelector(state => state.ui)

  console.log("Data in chat list item", data);

  const handleContactClick = () => {
    // if(currentChatUser?._id == data?.id) {
      dispatch(setCurrentChatUser(data))
      dispatch(setContactsPage(false))
    // }
  }

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?.profilePicture} />
      </div>

      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full ">
        <div className="flex justify-between">
          <div>
            <span className="text-white ">{data?.name}</span>
          </div>
        </div>
        
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2 ">
            <div className="flex justify-between w-full">
              <span className="text-secondary line-clamp-1 text-sm ">
                {data?.about || "\u00A0"}
              </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
