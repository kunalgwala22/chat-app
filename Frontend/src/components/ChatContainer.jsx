import React, { useRef } from "react";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthstore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/util";
import { Delete } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages ,unsubscribeFromMessages,deleteMessage} = useChatStore();
  const { authUser } = useAuthstore();
  const messageRef=useRef(null)


  useEffect(() => {
   
      getMessages(selectedUser._id);
      subscribeToMessages()
      return ()=> unsubscribeFromMessages()
  
  }, [selectedUser?._id, getMessages,unsubscribeFromMessages,subscribeToMessages]);
  
  useEffect(()=>{
    if(messageRef.current && messages){
    messageRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);

    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  if (isMessagesLoading) return <div>Loading...</div>;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      
        {messages.map((message) => (

          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageRef}
          >
            
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.jpg"
                      : selectedUser.profilePic || "/avatar.jpg"
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="chat-header mb-1 ">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time> 
            </div>
            <div className="chat-bubble flex flex-col relative group">
              {message.image && (
                <img
                  src={message.image}
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {message.senderId === authUser._id && (
                <button
                  onClick={() => handleDelete(message._id)}
                   className="absolute top-0 right-0 text-red-500 text-xs hover:underline flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Delete  className="w-4 h-4"/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
