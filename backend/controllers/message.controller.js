import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async(req,res) => {
    try {
        //getting message from user as input
        const {message} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

        //checking for existing convos
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        })
        //if no convo found create one
        if(!conversation){  
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        
        const newMessage = new Message ({
            senderId,
            receiverId,
            message,
        })
        //push msg into convo array
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
         // /* await conversation.save()  // <-- these 2 awaits will run separately
        //  await newMessage.save() */

        await Promise.all([conversation.save(), newMessage.save()]); //this one will run both at once

        
        //SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)

       

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getMessages = async (req,res) =>{
    try {
        const {id:userToChatId}= req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants:{ $all: [senderId, userToChatId] }
        }).populate("messages")
    
        if(!conversation) return res.status(200).json([])
        const messages = conversation.messages;

        res.status(200).json(conversation.messages)
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}