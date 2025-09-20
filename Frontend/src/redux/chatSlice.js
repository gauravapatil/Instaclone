import Messages from "@/components/messages";
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        Messages:[]
    },
    reducers:{
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload
        },
        setMessages:(state,action)=>{
            state.Messages = action.payload
        }
    }
});
export const {setOnlineUsers,setMessages} = chatSlice.actions
export default chatSlice.reducer;