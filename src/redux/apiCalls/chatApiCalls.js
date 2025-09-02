import { date } from "yup";
import request from "../../utils/request";
import { chatActions } from "../slices/chatSlice";
//login user
//Must return anonymous function

export function sendMessage(receiverId, senderId, text ){
return async(dispatch)=>{
  try{
    const {data} = await request.post('/messages', {receiverId, senderId, text });
  dispatch(chatActions.sendMessage(data.message));
  }catch(error){
  dispatch(chatActions.setError(error.response.data.message));
  }
}
}

export function getUserChats(userId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/chat/${userId}`);
      dispatch(chatActions.getChats(data));
    } catch (error) {
      dispatch(chatActions.setError(error.response.data.message));
    }
  };
}



export function getSingleChat(firstId , secondId) {
    return async (dispatch) => {
      try {
        const { data } = await request.get(`/chat/find/${firstId}/${secondId}`);
  
        dispatch(chatActions.getSingleChat(data)); 
      } catch (error) {
        dispatch(chatActions.setError(error.response.data.message));
      }
    };
  }


  export function getChatMessages(chatId) {
    return async (dispatch) => {
      try {
        const { data } = await request.get(`/messages/${chatId}`);
        dispatch(chatActions.getCurrentChatMessages(data));

      } catch (error) {
        dispatch(chatActions.setError(error.response.data.message));
      }
    };
  }

    export function updateLastMsgs(msg) {
    return async (dispatch) => {
      try {
        dispatch(chatActions.updateLastMsg(msg));
        
      } catch (error) {
        dispatch(chatActions.setError(error.response.data.message));
      }
    };
  }


export const deleteSingleMessage = (msgId, chatId, token) => {
  return async (dispatch) => {
    if(!token){
     throw new Error("unauthorized")
    }
    try {
      // 1️⃣ Optimistic update
      dispatch(chatActions.deleteMessageOptimistic({ msgId, chatId }));

      // 2️⃣ Request to server
      const {data} = await request.delete(`/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (data.deletedMessage) {
        dispatch(chatActions.confirmDeleteMessage({ msgId }));
        dispatch(chatActions.updateLastMsgInChatList({...data.lastMsg , chatId})) 
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      // 3️⃣ Rollback
      dispatch(chatActions.restoreDeletedMessage({ msgId, chatId }));
      dispatch(chatActions.setError("Error deleting message"));
    }
  };
};

