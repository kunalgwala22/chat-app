import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"


const BASE_URL= import.meta.env.MODE=== "development" ?  "http://localhost:8000": "/"

export const useAuthstore=create((set,get)=>(
   
    {
   authUser:null,
   isSigningUp:false,
   isLoggingIng:false,
   isUpdatingProfile:false,
   isChackingAuth:true,
   onlineUsers : [],
   socket:null,
   checkAuth:async(req,res)=>{
    try {
        const res = await axiosInstance.get("/auth/check");
        set({authUser:res.data})
        get().connectSocket()
    } catch (error) {
        console.log(error)
        set({authUser:null})
    }finally{
        set({isChackingAuth:false})
    }
   },

   signup:async(data)=>{
    set({isSigningUp:true})
    try {
     const res=await axiosInstance.post("/auth/signup",data)
     toast.success("account created successfully")
     get().connectSocket()
     set({authUser:res.data})
    } catch (error) {
        toast.error(error.response.data.message)
        
    }finally{
        set({isSigningUp:false})
    }
      
   },
logout:async ()=>{
    
    try {
         await axiosInstance.post("/auth/logout")
        set({authUser:null});
        toast.success("logged out successfully")
        get( ).disconnectSocket()
        
        
    } catch (error) {
        console.log(error)
        toast.error(error)
    }
},
login:async(data)=>{
    set({isLoggingIng:true})
    try {
     const res=await axiosInstance.post("/auth/login",data)
     toast.success("login successfully")
     get().connectSocket()
     set({authUser:res.data})
    } catch (error) {
        toast.error(error.response.data.message)
        
    }finally{
        set({isLoggingIng:false})
    }
      
   },
   updateProfile:async(data)=>{
    set({isUpdatingProfile:true})
    try {
        const res =await axiosInstance.put("/auth/update-profile",data)
        set({authUser:res.data})
        toast.success("Profile updated successfully")
        
    } catch (error) {
        console.log(error)
        toast.error("error in update profile")
    }finally{
        set({isUpdatingProfile:false})
    }
   },
   connectSocket:()=>{
    const {authUser} =get()
    if(!authUser || get().socket?.connected) return

     const socket= io(BASE_URL,{
        query:{
            userId:authUser._id
        }
     });
     socket.connect()
     set({socket:socket})
     socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})
     })

   },
   disconnectSocket:()=>{
     if(get().socket?.connected) get().socket.disconnect(); 
   }
}))