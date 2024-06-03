import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId],}
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId, receiverId, message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
            conversation.save();
        }

        // Socket io functionality will come here

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
        });

   } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        })
    }


}

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]},
        }).populate("messages"); // will give actual messages not reference

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}
