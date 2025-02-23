import React, { useEffect, useState } from "react";
import { GET_ALL_CONTACTS_ROUTE } from "../../utils/ApiRoutes";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setContactsPage } from "../../slices/uiSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import ChatListItem from "./ChatListItem";
import ContactList from "./ContactList";

const ContactsList = () => {
  const dispatch = useDispatch();
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS_ROUTE);
        console.log(users);
        setAllContacts(users);
        setSearchContacts(users)
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4 ">
        <div className="flex items-center gap-12 text-white ">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => {
              dispatch(setContactsPage(false));
            }}
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search Contacts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm focus:outline-none text-white w-full py-1"
              />
            </div>
          </div>
        </div>

        {Object.entries(searchContacts).map(([initialLetter, userList]) => 
          userList.length > 0 && (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map((contact) => (
                <ContactList
                  data={contact}
                  isContactsPage={true}
                  key={contact._id}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ContactsList;
