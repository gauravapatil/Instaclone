import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { getReceiverSocketId, io } from "../sockets/socket.js";

export const sendMessage=async (req,res)=>{

    try {
        const SenderId=req.id;
    const ReceiverId=req.params.id;;
    const {message} = req.body;
    // console.log(req.body)

    let convo= await Conversation.findOne({participants:{$all:[SenderId,ReceiverId]}})

    if(!convo){
        convo= await Conversation.create({participants:[SenderId,ReceiverId]})
    }

    const newMessage= await Message.create({SenderId,ReceiverId,message})
    if(newMessage){
        convo.messages.push(newMessage._id)
    }
    await Promise.all([convo.save(),newMessage.save()]);

    const ReceiverSocketId = getReceiverSocketId(ReceiverId)

    if(ReceiverSocketId){
        io.to(ReceiverSocketId).emit("newMessage",newMessage)
    }

    res.status(200).json({
        success:true,
        newMessage
    })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
    

}

export const getMessage= async(req,res)=>{

    const SenderId=req.id;
    const ReceiverId=req.params.id;

    const convo= await Conversation.findOne({participants:{$all:[SenderId,ReceiverId]}
    }).populate('messages')
    if(!convo) return res.status(200).json({success:true,messages:[]});

     res.status(200).json({success:true,messages:convo?.messages})
}