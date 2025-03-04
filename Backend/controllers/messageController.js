import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getUsersForSidebar =async(req,res)=>{
try {
    const loggedInUserId=req.user._id;
    const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
    res.status(200).json({filteredUsers})
} catch (error) {
    console.log(`error in message getUserSidebar ${error}`)
    res.status(500).json({message:"internal server error"})
}
}

export const getMessage=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const myId =req.user._id;
        
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log(`error in getMessage ${error}`)
        res.status(500).json({message:"internal server error"})
    }
}
export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId =req.user._id;

        let imageUrl;
        if(image){
            //upload to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        //socketio 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log(`error in send message ${error}`)
        res.status(500).json({message:"internal server error"})
    }
}