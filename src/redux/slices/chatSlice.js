import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    currentChat: null,
    selectedUser: null,
    currentChatMessages: [],
    error: null,
    deletedMessagesBackup: {},
  },
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    getChats(state, action) {
      state.chats = action.payload;
    },
    sendMessage(state, action) {
      state.currentChatMessages.push(action.payload);
    },

    // 🟢 Optimistic delete
    deleteMessageOptimistic(state, action) {
      const { msgId, chatId } = action.payload;
      if (state.currentChat && chatId === state.currentChat._id) {
        // نخزن نسخة عشان لو حصل error نرجعها
        const deletedMsg = state.currentChatMessages.find((msg) => msg._id === msgId);
        if (deletedMsg) {
          state.deletedMessagesBackup[msgId] = deletedMsg;
        }
        state.currentChatMessages = state.currentChatMessages.filter(
          (msg) => msg._id !== msgId
        );
      }
    },

    // 🟢 Confirm (لو السيرفر رجع نجاح)
    confirmDeleteMessage(state, action) {
      const { msgId } = action.payload;
      delete state.deletedMessagesBackup[msgId];
    },

    // 🟢 Restore (لو السيرفر رجع error)
    restoreDeletedMessage(state, action) {
      const { msgId, chatId } = action.payload;
      const backupMsg = state.deletedMessagesBackup[msgId];
      if (backupMsg && state.currentChat && chatId === state.currentChat._id) {
        state.currentChatMessages.push(backupMsg);
        delete state.deletedMessagesBackup[msgId];
      }
    },

    getSingleChat(state, action) {
      state.currentChat = action.payload;
    },
    getCurrentChatMessages(state, action) {
      state.currentChatMessages = action.payload;
    },
    clearChatMsgs(state) {
      state.currentChatMessages = [];
    },
    addMessageToCurrentChat(state, action) {
      if (state.currentChat && action.payload.chatId === state.currentChat._id) {
        state.currentChatMessages.push(action.payload);
      }
    },
    addOrUpdateChat(state, action) {
      const chatIndex = state.chats.findIndex((chat) => chat._id === action.payload._id);

      if (chatIndex !== -1) {
        state.chats[chatIndex] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },
    updateLastMsgInChatList(state, action) {
      const chat = state.chats.find((c) => c._id === action.payload.chatId);
  if (chat) {
    chat.lastMsg = action.payload.text ? {
      text: action.payload.text,
      createdAt: action.payload.createdAt,
      media: action.payload.media
    } : null}
  }
    ,
    
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    receiveMsg(state, action) {
      const msgExists = state.currentChatMessages.some(
        (msg) => msg._id === action.payload._id
      );
      if (!msgExists) {
        state.currentChatMessages.push(action.payload);
      }
    },
  },
});

const chatReducer = chatSlice.reducer;
const chatActions = chatSlice.actions;

export { chatReducer, chatActions };
