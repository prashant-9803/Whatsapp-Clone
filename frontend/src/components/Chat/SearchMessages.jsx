import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setMessageSearch } from "../../slices/messageSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import { calculateTime } from "../../utils/CalculateTime";

const SearchMessages = () => {
  const dispatch = useDispatch();
  const { currentChatUser } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.message);
  const [searchedMessages, setSearchedMessages] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(
        messages.filter(
          (message) =>
            message.type === "text" &&
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm]);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 gap-10 flex items-center bg-panel-header-background text-primary-strong ">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl "
          onClick={() => dispatch(setMessageSearch())}
        />
        <span>Search Messages</span>
      </div>
      <div className="custom-scrollbar overflow-auto h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full ">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
              </div>
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Messages"
                  className="bg-transparent text-sm focus:outline-none text-white w-full py-1"
                />
              </div>
            </div>
          </div>
          <span className="mt-4 text-secondary">
            {!searchTerm.length &&
              `Seach for messages with ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex justify-center  h-full flex-col ">
          {searchTerm.length > 0 && searchedMessages.length === 0 && (
            <span className="text-secondary w-full flex justify-center">
              No Messages Found
            </span>
          )}
          <div className="flex flex-col w-full h-full ">
            {searchedMessages.map((message) => (
              <div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[1px] border-secondary py-5 ">
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green ">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMessages;
