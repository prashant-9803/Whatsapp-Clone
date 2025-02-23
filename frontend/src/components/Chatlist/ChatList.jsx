import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
import ContactsList from "./ContactsList";

const ChatList = () => {
  const { contactsPage } = useSelector((state) => state.ui);

  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    setPageType(contactsPage ? "all-contacts" : "default");
  }, [contactsPage]);

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20 ">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {
        pageType === "all-contacts" && (
          <ContactsList/>
        )
      }
    </div>
  );
};

export default ChatList;
