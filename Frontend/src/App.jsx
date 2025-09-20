import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/signup'
import Login from './components/login'
import MainLayout from './components/Mainlayout'
import Profile from './components/profile'
import Homepage from './components/home'
import EditProfile from './components/editProfile'
import ChatPage from './components/chatpage'
// console.log("Chatpage:", ChatPage)
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import store from './redux/store'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { io } from 'socket.io-client'
import { setLikeNotification } from './redux/rtn'
import ProtectedRoutes from './components/protectedRoutes'


const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children:[
      {
        path:'/',
        element:<ProtectedRoutes><Homepage/></ProtectedRoutes>
      },
      {
        path:'/profile/:id',
        element:<ProtectedRoutes><Profile/></ProtectedRoutes>
      },
      {
        path:'/account/edit',
        element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>
      },
      {
        path:'/chat',
        element:<ProtectedRoutes><ChatPage/></ProtectedRoutes>
      }
    ]
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  }
])




function App() {
const {user} = useSelector(store=>store.auth)
const {socket} = useSelector(store=>store.socketio)

const dispatch = useDispatch()

  useEffect(()=>{

    if(user){
      const socketio= io('http://localhost:8000',{
        query:{
          userId:user?.id
        },
        transports:['websocket']
      })
      dispatch(setSocket(socketio))
      socketio.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      socketio.on('notification', (notification) =>{
        dispatch(setLikeNotification(notification))
      })
      return () =>{
        socketio.close();
        dispatch(setSocket(null))
      }
    }
    else if(socket){
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user,dispatch])

  return (
    <>
    <RouterProvider router={browserRouter}/>
    
        
    </>
  )
}

export default App
