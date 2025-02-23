import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    contactsPage: false,
    currentChatUser: undefined,
    
    videoCall: undefined,
    voiceCall: undefined,
    incomingVoiceCall: undefined,
    incomingVideoCall: undefined,
    endCall: undefined,
}

const uiSlice = createSlice({
    name: "ui",
    initialState: initialState,
    reducers: {
        setContactsPage: (state, action) => {
            state.contactsPage = action.payload
        },
        setCurrentChatUser: (state, action) => {
            state.currentChatUser = action.payload
        },
        setVideoCall: (state, action) => {
            state.videoCall = action.payload
        },
        setVoiceCall: (state, action) => {
            state.voiceCall = action.payload
        },
        setIncomingVoiceCall: (state, action) => {
            state.incomingVoiceCall = action.payload
        },
        setIncomingVideoCall: (state, action) => {
            state.incomingVideoCall = action.payload
        },
        setEndCall: (state) => {
            console.log("end call");
            state.voiceCall = undefined;
            state.videoCall = undefined;
            state.incomingVoiceCall = undefined;
            state.incomingVideoCall = undefined;
        },
        setExitChat: (state) => {
            state.currentChatUser = undefined;
        }
    },
})

export const { setContactsPage, setCurrentChatUser, setVideoCall,
    setVoiceCall,
    setIncomingVoiceCall,
    setIncomingVideoCall,
    setEndCall, setExitChat } = uiSlice.actions;
export default uiSlice.reducer 