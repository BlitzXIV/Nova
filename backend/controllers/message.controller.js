import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

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
            conversation.messages.push(newMessage.id)
        }
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}