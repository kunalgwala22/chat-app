import React, { useRef } from "react";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthstore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/util";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages ,unsubscribeFromMessages} = useChatStore();
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
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
