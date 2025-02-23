import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    socket: null,
    demo: false,
    messageSearch: false,
    userContacts : [],
    onlineUsers: [],

    filteredContacts: [],
    contactSearch: "", // Adding this to track search input
}

const messageSlice = createSlice({
    name: "message",
    initialState: initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        setDemo: (state, action) => {
            state.demo = action.payload
        },
        setMessageSearch: (state, action) => {
            state.messageSearch = !state.messageSearch
        },
        setUserContacts: (state, action) => {
            state.userContacts = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setContactSearch: (state, action) => {
            state.contactSearch = action.payload;
            state.filteredContacts = state.userContacts.filter((contact) =>
                contact._doc.name.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        
    }
})

export const { setMessages, setSocket, addMessage, setDemo, setMessageSearch, setUserContacts, setOnlineUsers,setContactSearch } = messageSlice.actions
export default messageSlice.reducer