import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_INITIAL_CONTACTS_ROUTE, SERVER_URL } from "../../utils/ApiRoutes";
import axios from "axios";
import { setOnlineUsers, setUserContacts } from "../../slices/messageSlice";
import ChatListItem from "./ChatListItem";

const List = () => {
  const { user } = useSelector((state) => state.auth);
  const { userContacts, filteredContacts } = useSelector(
    (state) => state.message
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getContacts = async () => {
      try {
        console.log(`${GET_INITIAL_CONTACTS_ROUTE}/${user._id}`);
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${user._id}`);

        console.log("users:", users);
        console.log("onlineUsers:", onlineUsers);

        dispatch(setOnlineUsers(onlineUsers));
        dispatch(setUserContacts(users));
        console.log("finding contacts:", users);
      } catch (error) {
        console.log("error while getting contacts", error);
      }
    };
    if (user._id) {
      getContacts();
    }
  }, [user]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatListItem key={contact?._doc?._id} data={contact} />
          ))
        : userContacts.map((contact) => (
            <ChatListItem key={contact?._doc?._id} data={contact} />
          ))}
    </div>
  );
};

export default List;
