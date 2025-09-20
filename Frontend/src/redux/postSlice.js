import {createSlice} from "@reduxjs/toolkit"
import { Satellite } from "lucide-react"

const postSlice = createSlice({
   name:'post',
   initialState:{
    posts:[],
    selectedPost:null
   },
   reducers:{
    setPosts:(state,action) =>{
        state.posts=action.payload
    },
    setSelectedPosts:(state,action) =>{
        state.selectedPost=action.payload;
    }
   }
})

export const {setPosts,setSelectedPosts} = postSlice.actions;

export default postSlice.reducer;