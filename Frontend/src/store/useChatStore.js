import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthstore } from "./useAuthStore";


export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
   

getUsers:async()=>{
    set({isUsersLoading:true})
    try {
        const res = await axiosInstance.get("/messages/users")
        set({users:res.data.filteredUsers})
       

    } catch (error) {
        toast.error(error.response.data.message)    
    }finally{
        set({isUsersLoading:false})
    }
},

getMessages:async(userId)=>{
    set({isUsersLoading:true})
    try {
        const res = await axiosInstance.get(`/messages/${userId}`)
        set({messages:res.data})

    } catch (error) {
        toast.error(error.response.data.message)
    }finally{
        set({isUsersLoading:false})
    }
},
sendMessage:async(messageData)=>{
const {selectedUser,messages}=get()
try {
    const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
    set({messages:[...messages,res.data]})
    toast.success("message sent successfully")
    
} catch (error) {
    toast.error(error.response.data.message)
}

},
subscribeToMessages:()=>{
    const {selectedUser}= get()
    if(!selectedUser) return;
    const socket=useAuthstore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
        set({messages:[...get().messages,newMessage],})
    })
},
unsubscribeFromMessages:()=>{
const socket=useAuthstore.getState().socket
},
 deleteMessage:async(messageId) => {
    try {
      const res = await axiosInstance.post("/messages/delete-message",{messageId})
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  },
setSelectedUser:(selectedUser)=>{set({selectedUser})},



}))