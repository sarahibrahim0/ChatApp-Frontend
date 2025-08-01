import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";


const chatSlice = createSlice({
    name: 'chat',
    initialState: {

        chats: [],
        currentChat: null,
        selectedUser : null ,
        currentChatMessages: [],
        lastMsgNew : "",
        error : null
    },
    reducers: {
        setError(state, action) {
            state.error = action.payload;
          },
          clearError(state) {
            state.error = null;
          },
        getChats(state , action) {
            state.chats = action.payload;
          },
        sendMessage (state, action){
          state.currentChatMessages.push(action.payload)
          
        },

        getSingleChat (state, action){
        state.currentChat = action.payload;
        },
        getCurrentChatMessages(state,action){
          state.currentChatMessages = action.payload;
        },
        clearChatMsgs(state)
        {
          state.currentChatMessages = [];
        },
        addMessageToCurrentChat: (state, action) => {
  if (state.currentChat && action.payload.chatId === state.currentChat._id) {
    state.currentChatMessages.push(action.payload);
  }
},
updateLastMsgInChatList: (state, action) => {
  const chat = state.chats.find(c => c._id === action.payload.chatId);
  if (chat) {
    chat.lastMsg = {
      text: action.payload.text,
      createdAt: action.payload.createdAt,
    };
  }
}

       ,
      setSelectedUser(state,action){
   state.selectedUser = action.payload;
       },
        receiveMsg(state, action)
        {
          const msgExists = state.currentChatMessages.some(msg => msg._id === action.payload._id);
           if (!msgExists) { state.currentChatMessages.push(action.payload); }        }


    }
});

const chatReducer = chatSlice.reducer;
const chatActions = chatSlice.actions;

export { chatReducer, chatActions };
